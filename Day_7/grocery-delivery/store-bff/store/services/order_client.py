import requests


ORDER_SERVICE_URL = "http://127.0.0.1:8003"


def get_store_orders(store_id):
    response = requests.get(
        f"{ORDER_SERVICE_URL}/api/orders/",
        params={"store_id": store_id},
        timeout=5,
    )

    response.raise_for_status()
    return response.json()


def update_order_status(order_id, new_status):
    response = requests.patch(
        f"{ORDER_SERVICE_URL}/api/orders/{order_id}/status/",
        json={"status": status},
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