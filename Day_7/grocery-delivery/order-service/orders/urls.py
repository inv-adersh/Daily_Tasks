from django.urls import path

from .views import OrderCreateView,OrderCancelView,OrderStatusUpdateView


urlpatterns = [
    path(
        "orders/",
        OrderCreateView.as_view(),
    ),

    path(
        "orders/<int:order_id>/cancel/",
        OrderCancelView.as_view(),
    ),

    path(
        "orders/<int:order_id>/status/",
        OrderStatusUpdateView.as_view(),
    ),
]