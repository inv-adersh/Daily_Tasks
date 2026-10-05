import hashlib
import json

from django.db import transaction
from .models import Order, OrderItem , OutboxEvent
from .store_client import reserve_stock,release_stock, reserve_delivery_slot


def generate_request_hash(customer_id, store_id, delivery_slot_id, items):
    
    data ={
        "customer_id":customer_id,
        "store_id":store_id,
        "delivery_slot_id":delivery_slot_id,
        "items":items,
    }

    data = json.dumps(data,sort_keys=True,default=str)
    
    return hashlib.sha256(data.encode()).hexdigest()
    

@transaction.atomic
def create_order(customer_id, store_id, delivery_slot_id, items, idempotency_key):

    request_hash = generate_request_hash(customer_id, store_id, delivery_slot_id, items)
    
    existing_order = Order.objects.filter(idempotency_key=idempotency_key).first()

    if existing_order:
        if existing_order.request_hash == request_hash:
            return existing_order
        raise ValueError("Idempotency key already used with different request")
        

    order = Order.objects.create(
        customer_id=customer_id,
        store_id=store_id,
        delivery_slot_id=delivery_slot_id,
        idempotency_key=idempotency_key,
        request_hash=request_hash,
    )

    reserve_delivery_slot(
        slot_id=delivery_slot_id,
        idempotency_key=f"{idempotency_key}-slot",
    )


    for item in items:
        reserve_stock(
            product_id=item["product_id"],
            quantity=item["quantity"],
            idempotency_key=f"{idempotency_key}-{item['product_id']}",
        )


        OrderItem.objects.create(
            order=order,
            product_id=item["product_id"],
            quantity=item["quantity"],
            price_snapshot=item["price_snapshot"],
        )

    OutboxEvent.objects.create(
    event_type="OrderCreated",
    aggregate_id=order.id,
    payload={
        "order_id": order.id,
        "customer_id": order.customer_id,
        "store_id": order.store_id,
        "delivery_slot_id": order.delivery_slot_id,
    },
)

    return order



ALLOWED_TRANSITIONS = {
    Order.Status.PENDING: {
        Order.Status.CONFIRMED,
        Order.Status.CANCELLED,
    },

    Order.Status.CONFIRMED: {
        Order.Status.PICKING,
        Order.Status.CANCELLED,
    },

    Order.Status.PICKING: {
        Order.Status.READY,
        Order.Status.SUBSTITUTION_REQUIRED,
        Order.Status.CANCELLED,
    },

    Order.Status.SUBSTITUTION_REQUIRED: {
        Order.Status.PICKING,
        Order.Status.CANCELLED,
    },

    Order.Status.READY: {
        Order.Status.OUT_FOR_DELIVERY,
    },

    Order.Status.OUT_FOR_DELIVERY: {
        Order.Status.COMPLETED,
    },

    Order.Status.COMPLETED: set(),

    Order.Status.CANCELLED: set(),
}


@transaction.atomic
def change_order_status(order_id, new_status):

    order = Order.objects.select_for_update().get(id=order_id)

    allowed_statuses = ALLOWED_TRANSITIONS.get(
        order.status,
        set()
    )

    if new_status not in allowed_statuses:
        raise ValueError(
            f"Cannot change order from "
            f"{order.status} to {new_status}"
        )

    order.status = new_status
    order.save(update_fields=["status", "updated_at"])

    return order


@transaction.atomic
def cancel_order(order_id):

    order = Order.objects.select_for_update().get(id=order_id)

    if order.status == Order.Status.CANCELLED:
        return order

    if order.status != Order.Status.CONFIRMED:
        raise ValueError(
            f"Cannot cancel order from {order.status} status"
        )

    order.status = Order.Status.CANCELLED

    order.save(
        update_fields=["status", "updated_at"]
    )

    items = list(
        order.items.values(
            "product_id",
            "quantity"
        )
    )

    OutboxEvent.objects.create(
        event_type="OrderCancelled",
        aggregate_id=order.id,
        payload={
            "order_id": order.id,
            "items": items,
        }
    )

    return order