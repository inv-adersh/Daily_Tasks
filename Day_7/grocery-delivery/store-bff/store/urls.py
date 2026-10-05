from django.urls import path

from .views import (
    StoreListView,
    ProductCreateView,
    ProductUpdateView,
    StockUpdateView,
    DeliverySlotCreateView,
    StoreOrderListView,
    AcceptOrderView,
    StartPickingView,
    MarkReadyView,
    StoreCancelOrderView,
)


urlpatterns = [
    path(
        "stores/",
        StoreListView.as_view(),
    ),

    path(
        "products/",
        ProductCreateView.as_view(),
    ),

    path(
        "products/<int:product_id>/",
        ProductUpdateView.as_view(),
    ),

    path(
        "products/<int:product_id>/stock/",
        StockUpdateView.as_view(),
    ),

    path(
        "delivery-slots/",
        DeliverySlotCreateView.as_view(),
    ),

    path(
        "stores/<int:store_id>/orders/",
        StoreOrderListView.as_view(),
    ),

    path(
        "orders/<int:order_id>/accept/",
        AcceptOrderView.as_view(),
    ),

    path(
        "orders/<int:order_id>/start-picking/",
        StartPickingView.as_view(),
    ),

    path(
        "orders/<int:order_id>/ready/",
        MarkReadyView.as_view(),
    ),

    path(
        "orders/<int:order_id>/cancel/",
        StoreCancelOrderView.as_view(),
    ),

]