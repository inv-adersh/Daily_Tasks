from django.db import models
import uuid


class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user_id = models.IntegerField()
    status = models.CharField(max_length=30)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product_id = models.UUIDField()
    quantity = models.PositiveIntegerField()


class Inventory(models.Model):
    product_id = models.UUIDField(unique=True)
    available_quantity = models.IntegerField()
    reserved_quantity = models.IntegerField(default=0)

class PaymentTransaction(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    idempotency_key = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=30)
    amount = models.DecimalField(max_digits=12, decimal_places=2)

class OutboxEvent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    aggregate_id = models.UUIDField()
    event_type = models.CharField(max_length=100)
    payload = models.JSONField()
    published_at = models.DateTimeField(null=True)
    created_at = models.DateTimeField(auto_now_add=True)
