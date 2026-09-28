import requests

def send_bank_webhook(transaction_id):
    url = "http://localhost:9000/mock-bank/webhook/"

    payload={
        "transaction_id": transaction_id,
    }

    requests.post(
        url,
        json=payload,
        timeout=5
    )