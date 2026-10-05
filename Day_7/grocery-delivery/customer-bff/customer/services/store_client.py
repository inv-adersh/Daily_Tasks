import requests


STORE_SERVICE_URL = "http://127.0.0.1:8002"


def get_stores():

    try:
        response = requests.get(
            f"{STORE_SERVICE_URL}/api/stores/",
            timeout=5
        )

        response.raise_for_status()

        return response.json()

    except requests.Timeout:
        raise RuntimeError("Store Service request timed out")

    except requests.RequestException:
        raise RuntimeError("Store Service is unavailable")


def get_products(store_id):
    try:
        response = requests.get(
            f"{STORE_SERVICE_URL}/api/stores/{store_id}/products/",
            timeout=5
        )

        response.raise_for_status()

        return response.json()

    except requests.Timeout:
        raise RuntimeError("Store Service request timed out")

    except requests.RequestException:
        raise RuntimeError("Store Service is unavailable")


def get_delivery_slots(store_id):
    try:
        response = requests.get(
            f"{STORE_SERVICE_URL}/api/stores/{store_id}/delivery-slots/",
            timeout=5
        )

        response.raise_for_status()

        return response.json()

    except requests.Timeout:
        raise RuntimeError("Store Service request timed out")

    except requests.RequestException:
        raise RuntimeError("Store Service is unavailable")