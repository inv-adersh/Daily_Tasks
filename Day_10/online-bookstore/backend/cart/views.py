from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Cart, CartItem
from .serializers import CartItemSerializer


class CartView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        cart, created = Cart.objects.get_or_create(user=request.user)

        items = cart.items.all()

        serializer = CartItemSerializer(items,many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


    def post(self,request):

        cart,created = Cart.objects.get_or_create(user=request.user)
        serializer = CartItemSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        book = serializer.validated_data["book"]
        quantity = serializer.validated_data["quantity"]

        if quantity > book.stock:
            return Response(
                {"error": "Requested quantity exceeds available stock."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            book=book,
            defaults={"quantity": quantity}
        )

        if not created:
            new_quantity = cart_item.quantity + quantity

            if new_quantity > book.stock:
                return Response(
                    {"error": "Requested quantity exceeds available stock."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        cart_item.quantity = new_quantity
        cart_item.save()
    
        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class CartItemDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        try:
            cart_item = CartItem.objects.get(pk=pk,cart__user=request.user)

        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CartItemSerializer(cart_item,data=request.data,partial=True)
        serializer.is_valid(raise_exception=True)

        quantity = serializer.validated_data.get("quantity",cart_item.quantity)

        if quantity > cart_item.book.stock:
            return Response(
                {"error": "Requested quantity exceeds available stock."},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_item.quantity = quantity
        cart_item.save()

        return Response(
            CartItemSerializer(cart_item).data,
            status=status.HTTP_200_OK
        )


    def delete(self, request, pk):

        try:
            cart_item = CartItem.objects.get(pk=pk,cart__user=request.user)

        except CartItem.DoesNotExist:
            return Response(
                {"error": "Cart item not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item.delete()

        return Response(
            {"message": "Item removed from cart"},
            status=status.HTTP_204_NO_CONTENT
        )


class ClearCartView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request):

        try:
            cart = Cart.objects.get(user=request.user)

        except Cart.DoesNotExist:
            return Response(
                {"message": "Cart is already empty"},
                status=status.HTTP_200_OK
            )

        cart.items.all().delete()

        return Response(
            {"message": "Cart cleared successfully"},
            status=status.HTTP_204_NO_CONTENT
        )