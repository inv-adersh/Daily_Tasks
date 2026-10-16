from rest_framework.routers import DefaultRouter
from .views import TransactionViewSet,MonthlySummaryAPIView,BudgetViewSet
from django.urls import include, path



router = DefaultRouter()

router.register(
    "transactions",
    TransactionViewSet,
    basename="transaction",
)

router.register(
    "budgets",
    BudgetViewSet,
    basename="budget",
)

urlpatterns = [
    path("", include (router.urls)),
    path("summary/",MonthlySummaryAPIView.as_view(),)
]