import os
import django

from django.contrib.auth.models import User
from books.models import Category, Book
from cart.models import Cart, CartItem
from orders.models import Order, OrderItem

user1, created = User.objects.get_or_create(username='user1', email='user1@example.com')
if created:
    user1.set_password('pass123')
    user1.save()

user2, created = User.objects.get_or_create(username='user2', email='user2@example.com')
if created:
    user2.set_password('pass123')
    user2.save()

cat1, _ = Category.objects.get_or_create(name='Fiction', description='Fiction Books')
cat2, _ = Category.objects.get_or_create(name='Science', description='Science Books')

book1, _ = Book.objects.get_or_create(title='1984', author='George Orwell', price=15.99, stock=100, isbn='1234567890', category=cat1)
book2, _ = Book.objects.get_or_create(title='A Brief History of Time', author='Stephen Hawking', price=20.50, stock=50, isbn='0987654321', category=cat2)

cart1, _ = Cart.objects.get_or_create(user=user1)
cart2, _ = Cart.objects.get_or_create(user=user2)

CartItem.objects.get_or_create(cart=cart1, book=book1, quantity=2)
CartItem.objects.get_or_create(cart=cart2, book=book2, quantity=1)

order1, _ = Order.objects.get_or_create(user=user1, total_amount=31.98, status='PENDING')
order2, _ = Order.objects.get_or_create(user=user2, total_amount=20.50, status='CONFIRMED')

OrderItem.objects.get_or_create(order=order1, book=book1, quantity=2, price=15.99)
OrderItem.objects.get_or_create(order=order2, book=book2, quantity=1, price=20.50)

print("--- USERS ---")
for u in User.objects.all():
    print(f"User: {u.username}, Email: {u.email}")

print("\n--- CATEGORIES ---")
for c in Category.objects.all():
    print(f"Category: {c.name}")

print("\n--- BOOKS ---")
for b in Book.objects.all():
    print(f"Book: {b.title} by {b.author}, Price: {b.price}, Stock: {b.stock}")

print("\n--- CARTS ---")
for c in Cart.objects.all():
    print(f"Cart for User: {c.user.username}")

print("\n--- CART ITEMS ---")
for ci in CartItem.objects.all():
    print(f"CartItem: {ci.quantity}x {ci.book.title} in Cart of {ci.cart.user.username}")

print("\n--- ORDERS ---")
for o in Order.objects.all():
    print(f"Order: {o.id} by {o.user.username}, Total: {o.total_amount}, Status: {o.status}")

print("\n--- ORDER ITEMS ---")
for oi in OrderItem.objects.all():
    print(f"OrderItem: {oi.quantity}x {oi.book.title} at {oi.price} in Order {oi.order.id}")
