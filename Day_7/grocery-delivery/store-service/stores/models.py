from django.db import models

class Store(models.Model):
    name = models.CharField(max_length=150)
    status = models.CharField(max_length=20)


class Product(models.Model):
    store = models.ForeignKey(
        Store,
        on_delete=models.CASCADE,
        related_name="products"
    )
    name = models.CharField(max_length=100)
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )
    is_available = models.BooleanField(default=True)

class Inventory(models.Model):
    product = models.OneToOneField(
        Product,
        on_delete=models.CASCADE,
        related_name="inventory"
    )
    stock_quantity = models.PositiveIntegerField(default=0)
    reserved_quantity = models.PositiveIntegerField(default=0)


class DeliverySlot(models.Model):
    store = models.ForeignKey(Store,on_delete=models.CASCADE,related_name="delivery_slots")
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    capacity = models.PositiveIntegerField()
    reserved_count = models.PositiveIntegerField(default=0)

class DeliverySlotReservation(models.Model):
    idempotency_key = models.CharField(max_length=100, unique=True)
    slot = models.ForeignKey(
        DeliverySlot,
        on_delete=models.CASCADE,
        related_name="reservations"
    )
    created_at = models.DateTimeField(auto_now_add=True)

class DeliverySlotRelease(models.Model):
    idempotency_key = models.CharField(max_length=100, unique=True)
    slot = models.ForeignKey(
        DeliverySlot,
        on_delete=models.CASCADE,
        related_name="releases"
    )
    created_at = models.DateTimeField(auto_now_add=True)


class StockReservation(models.Model):
    idempotency_key = models.CharField(max_length=100,unique=True)
    product_id = models.IntegerField()
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)


class StockRelease(models.Model):
    idempotency_key = models.CharField(max_length=100,unique=True)
    product_id = models.IntegerField()
    quantity = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)