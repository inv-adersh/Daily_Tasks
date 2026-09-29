from rest_framework import serializers

class OrderConfirmSerializer(serializers.Serializer):
    idempotency_key=serializers.CharField(required=True, max_length=100)
    