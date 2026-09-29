from celery import shared_task
from django.utils import timezone

from .models import OutboxEvent


@shared_task(
    bind=True,
    autoretry_for=(Exception,),   
    retry_backoff=True,
    max_retries =3,
)

def publish_outbox_events(self):

    events = OutboxEvent.objects.filter(
        published_at__isnull=True
    )

    for event in events:
        
        print("Publishing event:", event.event_type)
        print("Payload:", event.payload)

        print("Event published successfully")

        event.published_at = timezone.now()
        event.save()
            