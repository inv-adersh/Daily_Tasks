from django.urls import path
from .views import WalletDeductView


urlpatterns=[
    path("wallet/<uuid:wallet_id>/deduct/",WalletDeductView.as_view()),
]