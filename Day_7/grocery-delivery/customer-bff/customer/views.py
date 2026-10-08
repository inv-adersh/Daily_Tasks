from django.contrib.auth.models import User

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.store_client import (
    get_stores,
    get_products,
    get_delivery_slots,
)
from .services.order_client import (
    create_order,
    get_order,
    cancel_order,
)

class CustomerRegisterView(APIView):

    def post(self, request):

        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response(
                {
                    "error": "Username and password are required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {
                    "error": "Username already exists"
                },
                status=status.HTTP_409_CONFLICT,
            )

        user = User.objects.create_user(
            username=username,
            password=password,
        )   

        return Response(
            {
                "id": user.id,
                "username": user.username,
            },
            status=status.HTTP_201_CREATED,
        )




class CustomerStoreListView(APIView):

    def get(self, request):

        try:
            stores = get_stores()

            return Response(
                stores,
                status=status.HTTP_200_OK
            )

        except RuntimeError as exc:

            return Response(
                {"error": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class CustomerProductListView(APIView):

    def get(self, request, store_id):

        try:
            products = get_products(store_id)

            return Response(
                products,
                status=status.HTTP_200_OK
            )

        except RuntimeError as exc:

            return Response(
                {"error": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class CustomerDeliverySlotListView(APIView):

    def get(self, request, store_id):

        try:
            slots = get_delivery_slots(store_id)

            return Response(
                slots,
                status=status.HTTP_200_OK
            )

        except RuntimeError as exc:

            return Response(
                {"error": str(exc)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class CustomerOrderCreateView(APIView):

    def post(self, request):
        idempotency_key = request.headers.get("Idempotency-Key")

        if not idempotency_key:
            return Response(
                {"error": "Idempotency-Key header is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            order = create_order(
                data=request.data,
                idempotency_key=idempotency_key,
            )

            return Response(
                order,
                status=status.HTTP_201_CREATED,
            )

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )

class CustomerOrderDetailView(APIView):

    def get(self, request, order_id):

        try:
            order = get_order(order_id)

            return Response(order)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_404_NOT_FOUND,
            )


class CustomerOrderCancelView(APIView):

    def post(self, request, order_id):

        try:
            order = cancel_order(order_id)

            return Response(order)

        except Exception as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )