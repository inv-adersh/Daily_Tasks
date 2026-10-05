from django.urls import path
from .views import WalletDeductView


urlpatterns=[
    path("wallet/<str:wallet_id>/deduct/",WalletDeductView.as_view()),
]