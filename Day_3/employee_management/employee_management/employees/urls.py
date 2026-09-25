from django.urls import path
from . import views

urlpatterns = [
    path('',views.EmployeeList.as_view(),name="employee-list"),
    path("orm-all", views.ORMPAllView.as_view(), name="orm-all"),
    path("orm-get", views.ORMGetView.as_view(), name="orm-get"),
    path("orm-filter", views.ORMFilterView.as_view(), name="orm-filter"),
    path("orm-exclude",views.ORMExcludeView.as_view(),name="orm-exclude"),
    path("orm-firstlast",views.ORMFirstLastView.as_view(),name="orm-firstlast"),
    path("orm-values",views.ORMValuesView.as_view(),name="orm-values"),
    path("orm-values-list",views.ORMValuesListView.as_view(),name="orm-values-list"),
    path("orm-annotate",views.ORMAnnotateView.as_view(),name="orm-annotate"),
    path("orm-annotate-salary",views.ORMAnnotateSalaryView.as_view(),name="orm-annotate-salary"),
    path("orm-aggregate",views.ORMAggregateView.as_view(),name="orm-aggregate"),
    path("orm-ordering",views.ORMOrderingView.as_view(),name="orm-ordering"),
    path("orm-ordering-date",views.ORMJoiningDateOrderView.as_view(),name="orm-ordering-date"),
]
