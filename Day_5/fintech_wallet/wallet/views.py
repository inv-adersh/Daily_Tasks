from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .serializers import DeductSerializer
from .services import deduct_from_wallet


class WalletDeductView(APIView):

    def post (self,request, wallet_id):

        serializer = DeductSerializer(data=request.data)
        serializer.is_valid(raise_exception = True)

        amount = serializer.validated_data["amount"]

        try:
            transaction_log= deduct_from_wallet(wallet_id,amount)

        except ValueError as e:

            return Response(
                {"detail":str(e)},
                status = status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"message":"success"},
            status=status.HTTP_200_OK
        )   
