from celery import shared_task

from .models import OutboxEvent
from .store_client import release_stock,release_delivery_slot


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_backoff=True,
    retry_kwargs={"max_retries": 5},
)

def process_order_cancelled(self, event_id):

    event = OutboxEvent.objects.get(id=event_id)

    if event.published:
        return

    for item in event.payload["items"]:

        release_stock(
            product_id=item["product_id"],
            quantity=item["quantity"],
            idempotency_key=(
                f"order-{event.aggregate_id}"
                f"-release-{item['product_id']}"
            ),
        )
    release_delivery_slot(
        slot_id=event.payload["delivery_slot_id"],
        idempotency_key=(
            f"order-{event.aggregate_id}"
            f"-slot-release"
        ),
    )

    event.published = True

    event.save(update_fields=["published"])

def publish_outbox_events(self):

    events = OutboxEvent.objects.filter(
        published=False
    ).order_by("created_at")[:100]

    for event in events:

        print("Publishing event:", {
            "event_id": str(event.id),
            "event_type": event.event_type,
            "aggregate_id": event.aggregate_id,
            "payload": event.payload,
        })

        event.published = True
        event.save(update_fields=["published"])