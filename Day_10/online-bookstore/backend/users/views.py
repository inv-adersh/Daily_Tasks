from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User
from .serializers import RegisterSerializer


class RegisterView(APIView):

    def post(self, request):

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=serializer.validated_data["password"],
        )

        return Response(
            {"message": "Registration successful"},
            status=status.HTTP_201_CREATED
        )

class ProfileView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "id":user.id,
                "username": user.username,
                "email": user.email
            },
            status=status.HTTP_200_OK
        )


        