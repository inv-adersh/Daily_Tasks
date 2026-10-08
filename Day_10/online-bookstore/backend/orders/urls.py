from django.urls import path

from .views import (
    OrderCreateView,
    OrderListView,
    OrderDetailView,
    OrderCancelView,
)


urlpatterns = [

    path(
        "",
        OrderCreateView.as_view(),
        name="order-create"
    ),

    path(
        "list/",
        OrderListView.as_view(),
        name="order-list"
    ),

    path(
        "<int:pk>/",
        OrderDetailView.as_view(),
        name="order-detail"
    ),

    path(
        "<int:pk>/cancel/",
        OrderCancelView.as_view(),
        name="order-cancel"
    ),
]