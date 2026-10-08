from rest_framework import serializers
from .models import Book,Category

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = "__all__"



class BookSerializer(serializers.ModelSerializer):

    class Meta:
        model = Book
        fields = "__all__"


    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than 0."
            )

        return value