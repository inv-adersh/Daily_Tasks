import os
import django

from concurrent.futures import ThreadPoolExecutor

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings",
)

django.setup()

from orders.models import Order, PaymentTransaction, OutboxEvent
from orders.services import confirm_order


# Get an existing PENDING order
order = Order.objects.filter(status="PENDING").first()

if not order:
    print("No PENDING order found.")
    exit()

print("Testing order:", order.id)

idempotency_key = "concurrent-test-001"


def confirm():
    try:
        result = confirm_order(
            order_id=order.id,
            idempotency_key=idempotency_key,
        )

        return {
            "success": True,
            "status": result.status,
        }

    except Exception as exc:
        return {
            "success": False,
            "error": str(exc),
        }


# Send 10 requests concurrently
with ThreadPoolExecutor(max_workers=10) as executor:

    results = list(
        executor.map(
            lambda _: confirm(),
            range(10),
        )
    )


print("\nResults:")

for result in results:
    print(result)


# Refresh database objects
order.refresh_from_db()


payment_count = PaymentTransaction.objects.filter(
    order=order
).count()

outbox_count = OutboxEvent.objects.filter(
    aggregate_id=order.id,
    event_type="OrderConfirmed",
).count()


print("\nFinal database state:")
print("Order status:", order.status)
print("Payment count:", payment_count)
print("Outbox count:", outbox_count)