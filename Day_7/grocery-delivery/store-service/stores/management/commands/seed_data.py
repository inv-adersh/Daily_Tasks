from django.core.management.base import BaseCommand
from stores.models import Store, Product, Inventory, DeliverySlot
from datetime import date, time


class Command(BaseCommand):
    help = "Seed the database with sample store data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")

        # Stores
        store1 = Store.objects.create(name="FreshMart Downtown", status="OPEN")
        store2 = Store.objects.create(name="GreenGrocer Uptown", status="OPEN")

        # Products for store1
        products_s1 = [
            ("Organic Bananas", "1.49"),
            ("Whole Milk (1L)", "2.99"),
            ("Sourdough Bread", "4.50"),
            ("Free Range Eggs (12)", "5.99"),
            ("Cheddar Cheese (200g)", "3.75"),
        ]

        # Products for store2
        products_s2 = [
            ("Cherry Tomatoes (500g)", "3.20"),
            ("Baby Spinach (150g)", "2.50"),
            ("Greek Yogurt (400g)", "4.10"),
            ("Orange Juice (1L)", "3.80"),
            ("Brown Rice (1kg)", "2.99"),
        ]

        for name, price in products_s1:
            p = Product.objects.create(store=store1, name=name, price=price, is_available=True)
            Inventory.objects.create(product=p, stock_quantity=100, reserved_quantity=0)

        for name, price in products_s2:
            p = Product.objects.create(store=store2, name=name, price=price, is_available=True)
            Inventory.objects.create(product=p, stock_quantity=80, reserved_quantity=0)

        # Delivery slots for store1
        for hour in [9, 12, 15, 18]:
            DeliverySlot.objects.create(
                store=store1,
                date=date(2026, 10, 1),
                start_time=time(hour, 0),
                end_time=time(hour + 2, 0),
                capacity=20,
                reserved_count=0,
            )

        # Delivery slots for store2
        for hour in [10, 14, 17]:
            DeliverySlot.objects.create(
                store=store2,
                date=date(2026, 10, 1),
                start_time=time(hour, 0),
                end_time=time(hour + 2, 0),
                capacity=15,
                reserved_count=0,
            )

        self.stdout.write(self.style.SUCCESS(
            f"Done! Created 2 stores, 10 products, 10 inventory records, 7 delivery slots."
        ))
