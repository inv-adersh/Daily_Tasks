from django.urls import path

from .views import OrderConfirmView


urlpatterns = [
    path("orders/<uuid:order_id>/confirm/",OrderConfirmView.as_view(), name="order-confirm",),
]