from rest_framework import serializers

from .models import CartItem


class CartItemSerializer(serializers.ModelSerializer):

    book_price = serializers.DecimalField(source="book.price",read_only=True,max_digits=10,decimal_places=2)

    class Meta:
        model = CartItem
        fields = [
            "id",
            "book",
            "quantity",
            "book_price",
        ]


    