import requests


STORE_SERVICE_URL = "http://127.0.0.1:8002"


def get_stores():
    response = requests.get(
        f"{STORE_SERVICE_URL}/api/stores/",
        timeout=5,
    )

    response.raise_for_status()

    return response.json()


def create_product(data):
    response = requests.post(
        f"{STORE_SERVICE_URL}/api/products/",
        json=data,
        timeout=5,
    )

    response.raise_for_status()

    return response.json()


def update_product(product_id, data):
    response = requests.patch(
        f"{STORE_SERVICE_URL}/api/products/{product_id}/",
        json=data,
        timeout=5,
    )

    response.raise_for_status()

    return response.json()


def update_stock(product_id, data, idempotency_key):
    response = requests.patch(
        f"{STORE_SERVICE_URL}/api/inventory/{product_id}/",
        json=data,
        headers={
            "Idempotency-Key": idempotency_key,
        },
        timeout=5,
    )

    response.raise_for_status()

    return response.json()


def create_delivery_slot(data):
    response = requests.post(
        f"{STORE_SERVICE_URL}/api/delivery-slots/",
        json=data,
        timeout=5,
    )

    response.raise_for_status()

    return response.json()