from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import OrderSerializer
from .services import create_order,cancel_order,change_order_status
from .models import Order


class OrderCreateView(APIView):

    def get(self, request):

        store_id = request.query_params.get("store_id")

        if not store_id:
            return Response(
                {"error": "store_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        orders = Order.objects.filter(
            store_id=store_id
        ).order_by("-created_at")

        return Response(
            OrderSerializer(orders, many=True).data,
            status=status.HTTP_200_OK,
        )


    def post(self, request):

        idempotency_key = request.headers.get("Idempotency-Key")

        if not idempotency_key:
            return Response(
                {
                    "error": "Idempotency-Key header is required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = OrderSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            order = create_order(
                customer_id=request.data["customer_id"],
                store_id=request.data["store_id"],
                delivery_slot_id=request.data["delivery_slot_id"],
                items=request.data.get("items"),
                idempotency_key=idempotency_key,
            )
        except ValueError as e:
            return Response(
                {
                    "error": str(e)
                },
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )

class OrderCancelView(APIView):

    def post(self, request, order_id):

        try:
            order = cancel_order(order_id)

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_409_CONFLICT
            )
        return Response(
            {
                "id": order.id,
                "status": order.status,
            },
            status=status.HTTP_200_OK
        )


class OrderStatusUpdateView(APIView):

    def patch(self, request, order_id):

        new_status = request.data.get("status")

        if not new_status:
            return Response(
                {"error": "status is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = change_order_status(
                order_id=order_id,
                new_status=new_status,
            )

        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_200_OK,
        )