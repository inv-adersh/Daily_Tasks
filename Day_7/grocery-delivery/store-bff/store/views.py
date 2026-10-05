from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.store_client import (
    get_stores,
    create_product,
    update_product,
    update_stock,
    create_delivery_slot,
)
from .services.order_client import (
    get_store_orders,
    update_order_status,
    cancel_order,
)

class StoreListView(APIView):

    def get(self, request):

        try:
            data = get_stores()
            return Response(data)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class ProductCreateView(APIView):

    def post(self, request):

        try:
            data = create_product(request.data)
            return Response(
                data,
                status=status.HTTP_201_CREATED,
            )

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class ProductUpdateView(APIView):

    def patch(self, request, product_id):

        try:
            data = update_product(
                product_id,
                request.data,
            )

            return Response(data)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class StockUpdateView(APIView):

    def patch(self, request, product_id):

        idempotency_key = request.headers.get(
            "Idempotency-Key"
        )

        if not idempotency_key:
            return Response(
                {"error": "Idempotency-Key header is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            data = update_stock(
                product_id,
                request.data,
                idempotency_key,
            )

            return Response(data)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class DeliverySlotCreateView(APIView):

    def post(self, request):

        try:
            data = create_delivery_slot(request.data)

            return Response(
                data,
                status=status.HTTP_201_CREATED,
            )

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )





class StoreOrderListView(APIView):

    def get(self, request, store_id):

        try:
            orders = get_store_orders(store_id)

            return Response(orders)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class AcceptOrderView(APIView):

    def post(self, request, order_id):

        try:
            order = update_order_status(
                order_id,
                "CONFIRMED",
            )

            return Response(order)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class StartPickingView(APIView):

    def post(self, request, order_id):

        try:
            order = update_order_status(
                order_id,
                "PICKING",
            )

            return Response(order)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class MarkReadyView(APIView):

    def post(self, request, order_id):

        try:
            order = update_order_status(
                order_id,
                "READY",
            )

            return Response(order)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

class StoreCancelOrderView(APIView):

    def post(self, request, order_id):

        try:
            order = cancel_order(order_id)

            return Response(order)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )