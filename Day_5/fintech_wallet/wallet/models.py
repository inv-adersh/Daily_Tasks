import uuid
from django.db import models


class Wallet(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default = uuid.uuid4,
        editable=False
    )
    
    user_id = models.IntegerField(
        unique = True
    )

    balance=models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0.0
    )

    is_frozen = models.BooleanField(
        default=False
    )

class TransactionLogQuerySet(models.QuerySet):
    pass


class TransactionLogManager(models.Manager):
    def get_queryset(self):
        return TransactionLogQuerySet(
            self.model,
            using=self._db
        ).filter(is_deleted=False)

    def all_with_deleted(self):
        return TransactionLogQuerySet(
            self.model,
            using=self._db
        )


class TransactionLog(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    wallet = models.ForeignKey(
        Wallet,
        on_delete=models.CASCADE,
        related_name="logs"
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    reference_code = models.CharField(
        max_length=50,
        unique=True
    )

    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    objects = TransactionLogManager()
