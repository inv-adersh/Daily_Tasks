from rest_framework import serializers
from .models import Store, Product, Inventory, DeliverySlot


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = "__all__"


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = "__all__"


class DeliverySlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliverySlot
        fields = "__all__"



class StockReservationSerializer(serializers.Serializer):

    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class StockReleaseSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)

class DeliverySlotReservationSerializer(serializers.Serializer):
    slot_id = serializers.IntegerField()

class DeliverySlotReleaseSerializer(serializers.Serializer):
    slot_id = serializers.IntegerField()