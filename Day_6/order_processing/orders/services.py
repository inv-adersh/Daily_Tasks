from django.db import transaction   
from .models import Order,OrderItem,Inventory, PaymentTransaction, OutboxEvent
from .tasks import publish_outbox_events


def confirm_order(order_id,idempotency_key):
    
    with transaction.atomic():
    
        order = Order.objects.select_for_update().get(id=order_id)
        existing_payment= PaymentTransaction.objects.filter(order=order).first()

        if existing_payment:
            if existing_payment.idempotency_key == idempotency_key:
                return order
            raise ValueError("Order has already been processed with a different key")

        if order.status != "PENDING":
            raise ValueError(f"Order cannot be confirmed from status: {order.status}")

        order_items= OrderItem.objects.filter(order=order).order_by("product_id")

        for item in order_items:

            inventory = Inventory.objects.select_for_update().get(product_id = item.product_id)

            if inventory.available_quantity < item.quantity:
                raise ValueError(
                    f"Insufficient stock for product:{item.product_id}"
                )

            inventory.available_quantity -= item.quantity
            inventory.reserved_quantity += item.quantity
            inventory.save()

          
        PaymentTransaction.objects.create(
            order=order,
            idempotency_key=idempotency_key,
            amount=order.total_amount,
            status= "SUCCESS",
        )
                
        order.status = "CONFIRMED"
        order.save()
                
        OutboxEvent.objects.create(
            aggregate_id=order.id,
            event_type="OrderConfirmed",
            payload={
                "order_id":str(order.id),
            },
        )
        
        transaction.on_commit(lambda: publish_outbox_events.delay())

        return order    
