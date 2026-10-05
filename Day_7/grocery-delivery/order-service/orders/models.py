from django.db import models


class Order(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING"
        CONFIRMED = "CONFIRMED"
        PICKING = "PICKING"
        SUBSTITUTION_REQUIRED = "SUBSTITUTION_REQUIRED"
        READY = "READY"
        OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
        COMPLETED = "COMPLETED"
        CANCELLED = "CANCELLED"

    customer_id = models.IntegerField()
    store_id = models.IntegerField()
    delivery_slot_id = models.IntegerField()

    idempotency_key = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
    )

    request_hash = models.CharField(
        max_length=64,
        null=True,
        blank=True,
    )

    status = models.CharField(
        max_length=30,
        choices=Status.choices,
        default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class OrderItem(models.Model):

    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product_id = models.IntegerField()
    quantity = models.PositiveIntegerField()
    price_snapshot = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )


class OutboxEvent(models.Model):
    event_type = models.CharField(max_length=100)
    aggregate_id = models.IntegerField()
    payload = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
    published = models.BooleanField(default=False)