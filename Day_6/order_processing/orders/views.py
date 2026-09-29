from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist

from .serializers import OrderConfirmSerializer
from .services import confirm_order

class OrderConfirmView(APIView):
    
    def post(self,request,order_id):

        serializer = OrderConfirmSerializer(data = request.data)
        serializer.is_valid(raise_exception=True)

        idempotency_key = serializer.validated_data["idempotency_key"]
        
        try:    
            order = confirm_order(order_id,idempotency_key)

        except ObjectDoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        except ValueError as exc:
            return Response(
                {"error": str(exc)},
                status=status.HTTP_400_BAD_REQUEST,
            )



        return Response(
            {
                "message": "Order confirmation received",
                "order_id": str(order_id),
                "status":order.status,
            },
            status=status.HTTP_200_OK,
        )
            