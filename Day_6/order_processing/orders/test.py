import json
import redis
from celery import shared_task
from django.conf import settings
from django.utils import timezone

from .models import OutboxEvent

# Redis Stream name where order events are published
STREAM_NAME = "order_events"


class BrokerPublishError(Exception):
    pass


def get_redis_client():
    """Create a Redis client using the same URL as Celery broker."""
    return redis.Redis.from_url(
        settings.CELERY_BROKER_URL,
        decode_responses=True,
    )


def publish_to_broker(event):
    """Publish an outbox event to a Redis Stream."""
    try:
        client = get_redis_client()

        # xadd() writes a message to the Redis Stream
        # '*' means Redis auto-generates the message ID
        message_id = client.xadd(
            STREAM_NAME,
            {
                "event_id":      str(event.id),
                "event_type":    event.event_type,
                "aggregate_id":  str(event.aggregate_id),
                "payload":       json.dumps(event.payload),
            },
        )
        print(f"[Redis Stream] Published event '{event.event_type}' → ID: {message_id}")

    except redis.RedisError as e:
        raise BrokerPublishError(f"Failed to publish to Redis Stream: {e}") from e



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

        

        