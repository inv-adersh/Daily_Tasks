from concurrent.futures import ThreadPoolExecutor

from .models import TransactionLog
from .pdf_generator import generate_receipt_pdf


executor = ThreadPoolExecutor(max_workers=3)

def generate_receipt_task(transaction_id):

    transaction = TransactionLog.objects.filter().last()

    generate_receipt_pdf(transaction)



def start_receipt_generation(transaction_id):
    executor.submit(
        generate_receipt_task,
        transaction_id
    )
