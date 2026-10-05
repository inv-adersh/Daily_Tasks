import requests


ORDER_SERVICE_URL = "http://127.0.0.1:8003"


def create_order(data, idempotency_key):
    response = requests.post(
        f"{ORDER_SERVICE_URL}/api/orders/",
        json=data,
        headers={
            "Idempotency-Key": idempotency_key,
        },
        timeout=5,
    )

    response.raise_for_status()

    return response.json()


def get_order(order_id):
    response = requests.get(
        f"{ORDER_SERVICE_URL}/api/orders/{order_id}/",
        timeout=5,
    )

    response.raise_for_status()

    return response.json()


def cancel_order(order_id):
    response = requests.post(
        f"{ORDER_SERVICE_URL}/api/orders/{order_id}/cancel/",
        timeout=5,
    )

    response.raise_for_status()

    return response.json()