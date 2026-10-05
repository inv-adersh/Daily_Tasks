from django.urls import path

from .views import (
    StoreListView,
    StoreProductListView,
    StoreDeliverySlotListView,
    StockReservationView,
    StockReleaseView,
    DeliverySlotReservationView,
    DeliverySlotReleaseView
)


urlpatterns = [
    path(
        "stores/",
        StoreListView.as_view(),
        name="store-list"
    ),
    
    path(
        "stores/<int:store_id>/products/",
        StoreProductListView.as_view(),
        name="store-products"
    ),

    path(
        "stores/<int:store_id>/delivery-slots/",
        StoreDeliverySlotListView.as_view(),
        name="store-delivery-slots"
    ),

    path(
        "inventory/reserve/",
        StockReservationView.as_view(),
        name="inventory-reserve"
    ),
    path(
        "inventory/release/",
        StockReleaseView.as_view(),
        name="inventory-release"
    ),
    path(
        "delivery-slots/reserve/",
        DeliverySlotReservationView.as_view(),
        name="delivery-slot-reserve",
    ),
    path(
    "delivery-slots/release/",
    DeliverySlotReleaseView.as_view(),
    name="delivery-slot-release",
),
]