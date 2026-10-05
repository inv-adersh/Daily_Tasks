from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Store, Product, DeliverySlot, Inventory
from .serializers import (
    StoreSerializer,
    ProductSerializer,
    DeliverySlotSerializer,
    StockReservationSerializer,
    StockReleaseSerializer,
    DeliverySlotReservationSerializer,
    DeliverySlotReleaseSerializer
    
)
from .services import reserve_stock , release_stock , reserve_delivery_slot ,release_delivery_slot


class StoreListView(APIView):

    def get(self, request):
        stores = Store.objects.all()

        serializer = StoreSerializer(stores, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class StoreProductListView(APIView):

    def get(self, request, store_id):
        products = Product.objects.filter(
            store_id=store_id,
            is_available=True
        )

        serializer = ProductSerializer(products, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

class StoreDeliverySlotListView(APIView):

    def get(self, request, store_id):
        slots = DeliverySlot.objects.filter(
            store_id=store_id
        )

        serializer = DeliverySlotSerializer(slots, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


class StockReservationView(APIView):

    def post(self, request):

        idempotency_key = request.headers.get("Idempotency-Key")

        if not idempotency_key:
            return Response(
                {"error": "Idempotency-Key header is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = StockReservationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        try:
            inventory = reserve_stock(
                product_id=product_id,
                quantity=quantity,
                idempotency_key=idempotency_key
            )

        except Inventory.DoesNotExist:
            return Response(
                {"error": "Inventory not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_409_CONFLICT
            )

        return Response(
            {
                "product_id": product_id,
                "reserved_quantity": inventory.reserved_quantity,
                "stock_quantity": inventory.stock_quantity,
            },
            status=status.HTTP_200_OK
        )

class StockReleaseView(APIView):

    def post(self, request):

        idempotency_key = request.headers.get(
            "Idempotency-Key"
        )

        if not idempotency_key:
            return Response(
                {"error": "Idempotency-Key header is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = StockReleaseSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data["product_id"]
        quantity = serializer.validated_data["quantity"]

        try:

            inventory = release_stock(
                product_id=product_id,
                quantity=quantity,
                idempotency_key=idempotency_key
            )

        except Inventory.DoesNotExist:

            return Response(
                {"error": "Inventory not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except ValueError as exc:

            return Response(
                {"error": str(exc)},
                status=status.HTTP_409_CONFLICT
            )

        return Response(
            {
                "product_id": product_id,
                "reserved_quantity": inventory.reserved_quantity,
                "stock_quantity": inventory.stock_quantity,
            },
            status=status.HTTP_200_OK
        )

class DeliverySlotReservationView(APIView):

    def post(self, request):

        idempotency_key = request.headers.get("Idempotency-Key")

        if not idempotency_key:
            return Response(
                {"error": "Idempotency-Key header is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = DeliverySlotReservationSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        slot_id = serializer.validated_data["slot_id"]

        try:
            slot = reserve_delivery_slot(
                slot_id=slot_id,
                idempotency_key=idempotency_key
            )

        except DeliverySlot.DoesNotExist:
            return Response(
                {"error": "Delivery slot not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_409_CONFLICT
            )

        return Response(
            {
                "slot_id": slot.id,
                "reserved_count": slot.reserved_count,
                "capacity": slot.capacity,
            },
            status=status.HTTP_200_OK
        )


class DeliverySlotReleaseView(APIView):

    def post(self, request):

        idempotency_key = request.headers.get(
            "Idempotency-Key"
        )

        if not idempotency_key:
            return Response(
                {"error": "Idempotency-Key header is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = DeliverySlotReleaseSerializer(
            data=request.data
        )

        serializer.is_valid(raise_exception=True)

        slot_id = serializer.validated_data["slot_id"]

        try:
            slot = release_delivery_slot(
                slot_id=slot_id,
                idempotency_key=idempotency_key,
            )

        except DeliverySlot.DoesNotExist:
            return Response(
                {"error": "Delivery slot not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(
            {
                "slot_id": slot.id,
                "reserved_count": slot.reserved_count,
                "capacity": slot.capacity,
            },
            status=status.HTTP_200_OK,
        )