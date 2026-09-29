import requests

def send_bank_webhook(transaction_id):
    url = "http://localhost:9000/mock-bank/webhook/"

    payload={
        "transaction_id": transaction_id,
    }

    try:
        requests.post(
            url,
            json=payload,
            timeout=5)
    except requests.RequestException as e:
        print(f"Webhook failed: {e}")  
