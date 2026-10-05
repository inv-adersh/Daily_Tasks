from django.db import transaction

from .models import Inventory, StockReservation, StockRelease,DeliverySlot ,DeliverySlotReservation, DeliverySlotRelease

@transaction.atomic
def reserve_stock(product_id, quantity, idempotency_key):

    inventory = Inventory.objects.select_for_update().get(product_id=product_id)

    existing_reservation = StockReservation.objects.filter(
                            idempotency_key=idempotency_key
                            ).first()

    if existing_reservation:

        if (
            existing_reservation.product_id == product_id
            and existing_reservation.quantity == quantity
        ):
            return inventory

        raise ValueError(
            "Idempotency key already used with different request"
        )

    available_stock = inventory.stock_quantity - inventory.reserved_quantity

    if available_stock < quantity:
        raise ValueError("Insufficient stock")

    inventory.reserved_quantity += quantity

    inventory.save(update_fields=["reserved_quantity"])

    StockReservation.objects.create(
        idempotency_key=idempotency_key,
        product_id=product_id,
        quantity=quantity
    )

    return inventory


@transaction.atomic
def release_stock(product_id, quantity, idempotency_key):

    inventory = Inventory.objects.select_for_update().get(product_id=product_id)

    existing_release = StockRelease.objects.filter(idempotency_key=idempotency_key).first()

    if existing_release:

        if (
            existing_release.product_id == product_id
            and existing_release.quantity == quantity
        ):
            return inventory

        raise ValueError(
            "Idempotency key already used with different release"
        )

    if inventory.reserved_quantity < quantity:
        raise ValueError(
            "Cannot release more stock than reserved"
        )

    inventory.reserved_quantity -= quantity

    inventory.save(update_fields=["reserved_quantity"])

    StockRelease.objects.create(
        idempotency_key=idempotency_key,
        product_id=product_id,
        quantity=quantity
    )

    return inventory


@transaction.atomic
def reserve_delivery_slot(slot_id, idempotency_key):

    existing_reservation = DeliverySlotReservation.objects.filter(idempotency_key=idempotency_key).first()

    if existing_reservation:
        if existing_reservation.slot_id == slot_id:
            return existing_reservation.slot

        raise ValueError("Idempotency key already used for a different slot")

    slot = DeliverySlot.objects.select_for_update().get(id=slot_id)

    if slot.reserved_count >= slot.capacity:
        raise ValueError("Delivery slot is full")

    slot.reserved_count += 1
    slot.save(update_fields=["reserved_count"])

    DeliverySlotReservation.objects.create(
        idempotency_key=idempotency_key,
        slot=slot
    )

    return slot


@transaction.atomic
def release_delivery_slot(slot_id, idempotency_key):

    existing_release = DeliverySlotRelease.objects.filter(
        idempotency_key=idempotency_key
    ).first()

    if existing_release:
        if existing_release.slot_id == slot_id:
            return existing_release.slot

        raise ValueError(
            "Idempotency key already used for a different slot"
        )

    slot = DeliverySlot.objects.select_for_update().get(
        id=slot_id
    )

    if slot.reserved_count <= 0:
        raise ValueError(
            "No reservation available to release"
        )

    slot.reserved_count -= 1

    slot.save(
        update_fields=["reserved_count"]
    )

    DeliverySlotRelease.objects.create(
        idempotency_key=idempotency_key,
        slot=slot,
    )

    return slot