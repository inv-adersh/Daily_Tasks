from django.db.models import Q
from django.db import models


class Category(models.TextChoices):
        SALARY = "SALARY","Salary"
        RENT = "RENT","Rent"
        FOOD = "FOOD", "Food"
        TRAVEL = "TRAVEL", "Travel"
        SHOPPING = "SHOPPING","Shopping"
        BILLS = "BILLS","Bills"
        ENTERTAINMENT = "ENTERTAINMENT","Entertainment"
        OTHERS = "OTHERS","Others"

class Transaction(models.Model):
    
    class TransactionType(models.TextChoices):
        INCOME = "INCOME","Income"
        EXPENSE = "EXPENSE", "Expense"
 
    title = models.CharField(max_length=100)
    transaction_type = models.CharField(max_length=10,choices= TransactionType.choices)
    category = models.CharField(max_length=20,choices = Category.choices)    
    amount = models.DecimalField(max_digits=12,decimal_places=2)
    date =  models.DateField()
    description = models.TextField(blank=True, default ="")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date","-id"]
       
        constraints = [
            models.CheckConstraint(
            condition=Q(amount__gt=0),
            name="transaction_amount_positive",
            )
        ]

    def __str__(self):
        return f"{self.title} - {self.transaction_type} - {self.amount}"

    
    

class Budget(models.Model):

    category= models.CharField(max_length=20,choices = Category.choices)
    month= models.DateField()
    limit = models.DecimalField(max_digits=12,decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-month","-category"]
        
        constraints = [
            models.UniqueConstraint(
                fields=["month","category"],
                name="unique_budget_per_category",
            ),
            models.CheckConstraint(
            condition=Q(limit__gt=0),
            name="limit_amount_positive",
            )
        ]

    def __str__(self):
        return f"{self.category} - {self.month} - {self.limit}"

        


