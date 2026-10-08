from django.urls import path

from .views import (
    BookListView,
    BookDetailView,
    CategoryListView,
    CategoryDetailView,
)


urlpatterns = [

    # Books
    path(
        "books/",
        BookListView.as_view(),
        name="book-list"
    ),

    path(
        "books/<int:pk>/",
        BookDetailView.as_view(),
        name="book-detail"
    ),

    # Categories
    path(
        "categories/",
        CategoryListView.as_view(),
        name="category-list"
    ),

    path(
        "categories/<int:pk>/",
        CategoryDetailView.as_view(),
        name="category-detail"
    ),
]