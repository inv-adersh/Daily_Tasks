from datetime import datetime,date
from decimal import Decimal
from django.db.models import Q, Sum

from rest_framework import viewsets,status
from rest_framework.views import APIView
from rest_framework.response import Response


from drf_spectacular.utils import (
    extend_schema,
    extend_schema_view,
    OpenApiParameter,
)


from .models import Transaction,Budget
from .serializers import ( 
    TransactionSerializer,
    TransactionFilterSerializer,
    MonthlySummaryQuerySerializer,
    CategoryExpenseSerializer,
    BudgetSerializer,
    BudgetFilterSerializer
)

@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name="transaction_type",
                location=OpenApiParameter.QUERY,
                required=False,
                description="Filter by transaction type.",
            ),
            OpenApiParameter(
                name="category",
                location=OpenApiParameter.QUERY,
                enum=[
                    "SALARY",
                    "FOOD",
                    "TRAVEL",
                    "SHOPPING",
                    "BILLS",
                    "ENTERTAINMENT",
                    "OTHERS",
                ],
                required=False,
                description="Filter by transaction category.",
            ),
            OpenApiParameter(
                name="start_date",
                location=OpenApiParameter.QUERY,
                required=False,
                description="Include transactions on or after this date.",
            ),
            OpenApiParameter(
                name="end_date",
                location=OpenApiParameter.QUERY,
                required=False,
                description="Include transactions on or before this date.",
            ),
        ]
    )
)

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer


    def get_queryset(self):
        
        filter_serializer = TransactionFilterSerializer(data=self.request.query_params)

        filter_serializer.is_valid(raise_exception=True)
        params = filter_serializer.validated_data

        queryset = Transaction.objects.all()

        if "transaction_type" in params:
            queryset = queryset.filter(transaction_type=params["transaction_type"])

        if "category" in params:
            queryset = queryset.filter(category=params["category"])

        if "start_date" in params:
            queryset = queryset.filter(date__gte=params["start_date"])

        if "end_date" in params:
            queryset = queryset.filter(date__lte=params["end_date"])

        return queryset    
    




@extend_schema(
    parameters=[MonthlySummaryQuerySerializer],
    description="Get monthly income, expenses, and category-wise breakdown.",
)

class MonthlySummaryAPIView(APIView):
    
    def get(self,request):

        query_serializer = MonthlySummaryQuerySerializer(data=request.query_params)

        query_serializer.is_valid(raise_exception=True)


        month = query_serializer.validated_data["month"]

        selected_date = datetime.strptime(month, "%Y-%m")

        year = selected_date.year
        month_number = selected_date.month

        transactions = Transaction.objects.filter(
            date__year = year,
            date__month = month_number,
        )

        total_inc = transactions.filter(
            transaction_type="INCOME"
            ).aggregate(total=Sum("amount"))

        total_exp = transactions.filter(
            transaction_type="EXPENSE"
            ).aggregate(total=Sum("amount"))
        

        total_income = total_inc["total"] or Decimal("0.00")
        total_expense = total_exp["total"] or Decimal("0.00")
        
        balance = total_income - total_expense 

        category_expenses = (
            transactions
            .filter(transaction_type=Transaction.TransactionType.EXPENSE)
            .values("category")
            .annotate(total=Sum("amount"))
            .order_by("category")
        )

        category_serializer = CategoryExpenseSerializer(
            category_expenses,
            many=True,
        )

        return Response({
            "month": month,
            "total_income": total_income,
            "total_expense": total_expense,
            "net_balance": balance,
            "category_summary": category_serializer.data,
        },
        status=status.HTTP_200_OK,
        )




@extend_schema_view(
    list=extend_schema(
        parameters=[BudgetFilterSerializer],
        description="Retrieve budgets, optionally filtered by month.",
    )
)

class BudgetViewSet(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer

    def get_queryset(self):
        queryset = Budget.objects.all()

        month = self.request.query_params.get("month")

        if month:
            month_serializer = BudgetFilterSerializer(data={"month": month})
            month_serializer.is_valid(raise_exception=True)
            year, month_number = map(int,month_serializer.validated_data["month"].split("-"))

            queryset = queryset.filter(
                month__year = year,
                month__month = month_number
            )
            
        return queryset