from rest_framework import serializers
from .models import Transaction,Budget,Category
from django.db.models import Sum

class TransactionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Transaction
        fields = "__all__"

        read_only_fields = ["id", "created_at", "updated_at"]

    
    def validate_amount(self,value):
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than 0")

        return value



class TransactionFilterSerializer(serializers.Serializer):

    transaction_type = serializers.ChoiceField(choices=Transaction.TransactionType.choices,required=False)
    category = serializers.ChoiceField(choices=Category.choices,required=False)
    start_date = serializers.DateField(required=False)
    end_date = serializers.DateField(required=False) 

    def validate(self,data):
        start_date = data.get("start_date")
        end_date = data.get("end_date")

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({
                "end_date": "End date must be after start date."
            })
        return data




class MonthlySummaryQuerySerializer(serializers.Serializer):
    month = serializers.RegexField(
        regex=r"^\d{4}-(0[1-9]|1[0-2])$",
        required=True,
        error_messages={
            "invalid": "Month must be in YYYY-MM format, for example 2026-10."
        },
    )

class BudgetFilterSerializer(serializers.Serializer):
    month = serializers.RegexField(
        regex=r"^\d{4}-(0[1-9]|1[0-2])$",
        required=False,
        error_messages={
            "invalid": "Month must be in YYYY-MM format, for example 2026-10."
        },
    )


class CategoryExpenseSerializer(serializers.Serializer):
    category = serializers.CharField()
    total = serializers.DecimalField(max_digits=12,decimal_places=2)





class BudgetSerializer(serializers.ModelSerializer):

    total_expenses = serializers.SerializerMethodField()
    percentage_used = serializers.SerializerMethodField()
    exceeded = serializers.SerializerMethodField()

    class Meta:
        model = Budget
        fields = [
            "id",
            "category",
            "month",
            "limit",
            "total_expenses",
            "percentage_used",
            "exceeded",
        ]
        
        read_only_fields = ["id","total_expenses","percentage_used","exceeded","created_at","updated_at"]

    def get_total_expenses(self,obj):
        expenses = Transaction.objects.filter(
            category = obj.category,
            transaction_type = Transaction.TransactionType.EXPENSE,
            date__year = obj.month.year,
            date__month = obj.month.month,
        ).aggregate(total=Sum("amount"))["total"]

        return expenses or 0

    def get_percentage_used(self,obj):
        expenses = self.get_total_expenses(obj)
        limit = obj.limit
        return (expenses / limit * 100)

    def get_exceeded(self,obj):
        expenses = self.get_total_expenses(obj)
        return expenses > obj.limit


    def validate_limit(self, value):
        if value <= 0:
            raise serializers.ValidationError("Budget limit must be greater than zero.")
        return value