from celery import shared_task
from django.utils import timezone

from .models import OutboxEvent



class BrokerPublishError(Exception):
    pass

def publish_to_broker(event):

    message={
        "event_id": str(event.id),
        "event_type": event.event_type,
        "aggregate_id": str(event.aggregate_id),
        "payload": event.payload
    }
    
    print("Publishing event:", message)
    print("Event published successfully")



@shared_task(
    autoretry_for=(BrokerPublishError,),
    retry_backoff=True,
    max_retries =3,
)

def publish_outbox_events():

    events = OutboxEvent.objects.filter(published_at__isnull=True)

    
    for event in events:    
        try:
            publish_to_broker(event)
        
        except BrokerPublishError:
            raise
        
        event.published_at = timezone.now()
        event.save()

        

        