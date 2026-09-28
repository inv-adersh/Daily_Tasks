import uuid
from django.db import transaction

from .models import Wallet,TransactionLog
from .webhooks import send_bank_webhook
from .tasks import start_receipt_generation



def deduct_from_wallet(wallet_id,amount):

    with transaction.atomic():

        wallet = Wallet.objects.select_for_update().get(id=wallet_id)

        if wallet.balance < amount:
            raise ValueError("Insufficient balance")

        wallet.balance -= amount
        wallet.save()

        transaction_log=TransactionLog.objects.create(
            wallet=wallet,
            amount=amount,
            reference_code =str(uuid.uuid4()),
        )

        transaction.on_commit(
            lambda:send_bank_webhook(
                str(transaction_log.id)
            )
        )

        transaction.on_commit(
            lambda:start_receipt_generation(
                str(transaction_log.id)
            )
        )

        return transaction_log