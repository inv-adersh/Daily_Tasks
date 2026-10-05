from django.urls import path

from .views import (
    CustomerStoreListView,
    CustomerProductListView,
    CustomerDeliverySlotListView,
    CustomerOrderCreateView,
    CustomerOrderDetailView,
    CustomerOrderCancelView,
)


urlpatterns = [

    path(
        "customer/stores/",
        CustomerStoreListView.as_view(),
        name="customer-store-list"
    ),

    path(
        "customer/stores/<int:store_id>/products/",
        CustomerProductListView.as_view(),
        name="customer-product-list"
    ),

    path(
        "customer/stores/<int:store_id>/delivery-slots/",
        CustomerDeliverySlotListView.as_view(),
        name="customer-delivery-slot-list"
    ),

    path(
        "customer/orders/",
        CustomerOrderCreateView.as_view(),
    ),

    path(
        "customer/orders/<int:order_id>/",
        CustomerOrderDetailView.as_view(),
    ),

    path(
        "customer/orders/<int:order_id>/cancel/",
        CustomerOrderCancelView.as_view(),
    ),

]