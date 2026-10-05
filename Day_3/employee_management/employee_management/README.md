# Employee Management Dashboard

## Project Overview

This project is a simple Employee Management Dashboard built using HTML, CSS, and JavaScript.

The frontend communicates with a Django backend API to fetch employee data and provides features such as searching, filtering, sorting, statistics, favorites, and browser storage.

## Technologies Used

- HTML
- CSS
- JavaScript
- Django REST API
- Browser DevTools

## HTTP Request and Response

The frontend sends an HTTP GET request to the Django API:

GET /employees/

The backend processes the request and returns employee data in JSON format.

Example response:

```json
[
    {
        "id": 1,
        "name": "Arun",
        "email": "arun@example.com",
        "salary": "50000.00",
        "joining_date": "2026-09-24",
        "phone_no": "9876543210",
        "department": "IT"
    }
]