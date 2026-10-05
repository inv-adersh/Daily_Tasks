import requests


STORE_SERVICE_URL = "http://127.0.0.1:8002"


def reserve_stock(product_id,quantity,idempotency_key):

    url = f"{STORE_SERVICE_URL}/api/inventory/reserve/"

    response = requests.post(
        url,
        json={
            "product_id": product_id,
            "quantity": quantity,
        },
        headers={
            "Idempotency-Key": idempotency_key,
        },
        timeout=5,
    )

    if response.status_code == 409:
        raise ValueError(
            response.json().get(
                "error",
                "Stock reservation failed"
            )
        )

    if response.status_code == 404:
        raise ValueError("Inventory not found")

    response.raise_for_status()

    return response.json()

def release_stock(product_id,quantity,idempotency_key):

    url = f"{STORE_SERVICE_URL}/api/inventory/release/"

    response = requests.post(
        url,
        json={
            "product_id": product_id,
            "quantity": quantity,
        },
        headers={
            "Idempotency-Key": idempotency_key,
        },
        timeout=5,
    )

    if response.status_code == 409:
        raise ValueError(
            response.json().get(
                "error",
                "Stock release failed"
            )
        )

    if response.status_code == 404:
        raise ValueError("Inventory not found")

    response.raise_for_status()

    return response.json()


def reserve_delivery_slot(slot_id, idempotency_key):
    response = requests.post(
        f"{STORE_SERVICE_URL}/api/delivery-slots/reserve/",
        json={
            "slot_id": slot_id,
        },
        headers={
            "Idempotency-Key": idempotency_key,
        },
        timeout=5,
    )

    if response.status_code == 409:
        raise ValueError(response.json().get("error", "Delivery slot unavailable"))

    if response.status_code == 404:
        raise ValueError("Delivery slot not found")

    response.raise_for_status()

    return response.json()


def release_delivery_slot(slot_id, idempotency_key):

    response = requests.post(
        f"{STORE_SERVICE_URL}/api/delivery-slots/release/",
        json={
            "slot_id": slot_id,
        },
        headers={
            "Idempotency-Key": idempotency_key,
        },
        timeout=5,
    )

    if response.status_code == 409:
        raise ValueError(
            response.json().get(
                "error",
                "Unable to release delivery slot"
            )
        )

    if response.status_code == 404:
        raise ValueError(
            "Delivery slot not found"
        )

    response.raise_for_status()

    return response.json()