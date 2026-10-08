from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .models import Book, Category
from .serializers import BookSerializer,CategorySerializer


class BookListView(APIView):

    def get(self, request):

        books = Book.objects.all()

        search = request.query_params.get("search")
        if search:
            books = books.filter(title__icontains=search) | books.filter(author__icontains =search)

        category = request.query_params.get("category")
        if category:
            books = books.filter(category_id=category)

        min_price = request.query_params.get("min_price")
        if min_price:
            books = books.filter(price__gte=min_price)    

        max_price = request.query_params.get("max_price")
        if max_price:
            books = books.filter(price__lte=max_price)
        

        serializer = BookSerializer(books, many=True)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )


    def post(self, request):

        serializer = BookSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        book = serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


class BookDetailView(APIView):

    def get(self, request, pk):

        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {"error": "Book not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(book)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):

        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {"error": "Book not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(book, data=request.data)

        serializer.is_valid(raise_exception=True)
        book = serializer.save()

        return Response(
            BookSerializer(book).data,
            status=status.HTTP_200_OK
        )

    def patch(self, request, pk):

        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {"error": "Book not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BookSerializer(
            book,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        book = serializer.save()

        return Response(
            BookSerializer(book).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):

        try:
            book = Book.objects.get(pk=pk)

        except Book.DoesNotExist:
            return Response(
                {"error": "Book not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        book.delete()

        return Response(
            {"message": "Book deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )



#Category

class CategoryListView(APIView):

    def get(self, request):

        categories = Category.objects.all()
        serializer = CategorySerializer(
            categories,
            many=True
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def post(self, request):

        serializer = CategorySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        category = serializer.save()

        return Response(
            CategorySerializer(category).data,
            status=status.HTTP_201_CREATED
        )


class CategoryDetailView(APIView):

    def get(self, request, pk):

        try:
            category = Category.objects.get(pk=pk)

        except Category.DoesNotExist:
            return Response(
                {"error": "Category not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CategorySerializer(category)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK
        )

    def put(self, request, pk):

        try:
            category = Category.objects.get(pk=pk)

        except Category.DoesNotExist:
            return Response(
                {"error": "Category not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CategorySerializer(
            category,
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        category = serializer.save()

        return Response(
            CategorySerializer(category).data,
            status=status.HTTP_200_OK
        )

    def patch(self, request, pk):

        try:
            category = Category.objects.get(pk=pk)

        except Category.DoesNotExist:
            return Response(
                {"error": "Category not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CategorySerializer(
            category,
            data=request.data,
            partial=True
        )

        serializer.is_valid(
            raise_exception=True
        )

        category = serializer.save()

        return Response(
            CategorySerializer(category).data,
            status=status.HTTP_200_OK
        )

    def delete(self, request, pk):

        try:
            category = Category.objects.get(pk=pk)

        except Category.DoesNotExist:
            return Response(
                {"error": "Category not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        category.delete()

        return Response(
            {"message": "Category deleted successfully"},
            status=status.HTTP_204_NO_CONTENT
        )