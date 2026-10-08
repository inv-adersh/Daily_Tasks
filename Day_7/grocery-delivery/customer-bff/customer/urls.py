from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    CustomerStoreListView,
    CustomerProductListView,
    CustomerDeliverySlotListView,
    CustomerOrderCreateView,
    CustomerOrderDetailView,
    CustomerOrderCancelView,
    CustomerRegisterView,
    
)


urlpatterns = [

    path(
        "register/",
        CustomerRegisterView.as_view(),
        name="customer-register",
    ),

    path(
        "login/",
        TokenObtainPairView.as_view(),
        name="customer-login",
    ),

    path(
        "refresh/",
        TokenRefreshView.as_view(),
        name="token-refresh",
    ),
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