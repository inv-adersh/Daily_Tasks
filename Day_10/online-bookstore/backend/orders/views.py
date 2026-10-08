from django.db import transaction

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import Order, OrderItem
from .serializers import OrderSerializer

from cart.models import Cart
from books.models import Book


class OrderCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:
            cart = Cart.objects.get(user=request.user)

        except Cart.DoesNotExist:
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        cart_items = cart.items.all()

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        with transaction.atomic():

            total_amount = 0
            locked_items = []

            for cart_item in cart_items:

                book = Book.objects.select_for_update().get(id=cart_item.book.id)

                if cart_item.quantity > book.stock:
                    return Response(
                        {"error": "Not enough stock for " + book.title},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                total_amount = total_amount + (book.price * cart_item.quantity)

                locked_items.append((cart_item, book))

            order = Order.objects.create(
                user=request.user,
                total_amount=total_amount,
                status="PENDING"    
            )

            for cart_item, book in locked_items:

                OrderItem.objects.create(
                    order=order,
                    book=book,
                    quantity=cart_item.quantity,
                    price=book.price,
                )

                book.stock -= cart_item.quantity
                book.save(update_fields=["stock"])

            cart.items.all().delete()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        orders = Order.objects.filter(user=request.user).order_by("-created_at")

        serializer = OrderSerializer(orders,many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class OrderDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):

        try:
            order = Order.objects.get(pk=pk, user=request.user)

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderSerializer(order)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class OrderCancelView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        try:
            order = Order.objects.get(pk=pk, user=request.user)

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if order.status != "PENDING":

            return Response(
                {"error": "Only pending orders can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )


        for item in order.items.all():

            book = item.book
            book.stock += item.quantity
            book.save(update_fields=["stock"])


        order.status = "CANCELLED"
        order.save(update_fields=["status"])

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK
        )