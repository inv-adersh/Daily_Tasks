from django.views import View
from django.shortcuts import render
from .models import Employee,Department
from django.http import JsonResponse
import json 
from django.db.models import Count, Avg, Sum, Max, Min

from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator


@method_decorator(csrf_exempt, name="dispatch")
class EmployeeList(View):
    
    def get(self,request):

        employees= Employee.objects.all()
        
        # for render template
        # return render(request,
        #                 "employees/employee_list.html", 
        #                 {"employees": employees})  


        data =[]

        for employee in employees:
            data.append({
                "id": employee.id,
                "name": employee.name,
                "email": employee.email,
                "salary": employee.salary,
                "joining_date": employee.joining_date,
                "phone_no": employee.phone_no,
                "department": employee.department.name,
            })

        return JsonResponse(data, safe=False)




    def post(self,request):

        data = json.loads(request.body)

        name = data.get("name")
        email = data.get("email")
        salary = data.get("salary")
        joining_date = data.get("joining_date")
        phone_no = data.get("phone_no")
        department_id = data.get("department_id")

        if not name or not email or not salary or not joining_date or not phone_no or not department_id:
            return JsonResponse({"error":"All fields are required"}, status=400)

        employee = Employee.objects.create(
                    name=name,
                    email=email,
                    salary=salary,
                    joining_date=joining_date,
                    phone_no=phone_no,
                    department_id=department_id,
        )
        return JsonResponse({  
                            "message":"Employee created successfully",
                            "id":employee.id,       
                            })  


        

class ORMPAllView(View):
    def get(self,request):

        employees= Employee.objects.all()

        data=[]

        for employee in employees:
            data.append({
                "id": employee.id,
                "name": employee.name,
                "email": employee.email,
                "salary": employee.salary,
                "joining_date": employee.joining_date,
                "phone_no": employee.phone_no,
                "department": employee.department.name,
            })

        return JsonResponse(data, safe=False)
        

class ORMGetView(View):
    def get(self, request):

        try:
            employee = Employee.objects.get(id=2)
            return JsonResponse({
                "id": employee.id,
                "name": employee.name,
                    })

        except Employee.DoesNotExist:
            return JsonResponse({
                "error":"Employee not found",
            }, status=404)

        except Employee.MultipleObjectsReturned:
            return JsonResponse({
                "error":"Multiple employees found",
            }, status=400)
        


class ORMFilterView(View):
    def get(self,request):
        
        data=[]

        employees=Employee.objects.filter(salary__gt=48000) 
        for employee in employees:
            data.append({
                "id": employee.id,
                "name": employee.name,
                "email": employee.email,
                "salary": employee.salary,
            })

        return JsonResponse(data, safe=False)


class ORMExcludeView(View):

    def get(self,request):
        employees =Employee.objects.exclude(department_id=2) 

        data=[]

        for emp in employees:
            data.append({
                "id":emp.id,
                "name":emp.name,
                "department":emp.department.name,
            })

        return JsonResponse(data, safe=False)

        
class ORMFirstLastView(View):

    def get(self, request):

        first_employee = Employee.objects.order_by("joining_date").first()
        last_employee = Employee.objects.order_by("joining_date").last()

        return JsonResponse({
            "first_joined": {
                "id": first_employee.id,
                "name": first_employee.name,
                "joining_date": first_employee.joining_date,
            },
            "most_recent": {
                "id": last_employee.id,
                "name": last_employee.name,
                "joining_date": last_employee.joining_date,
            }
        })



class ORMOrderingView(View):

    def get(self, request):

        employees = Employee.objects.order_by("-salary")

        data = []

        for employee in employees:
            data.append({
                "id": employee.id,
                "name": employee.name,
                "salary": str(employee.salary),
                "joining_date": employee.joining_date,
            })

        return JsonResponse(data, safe=False)


class ORMJoiningDateOrderView(View):

    def get(self, request):

        employees = Employee.objects.order_by("joining_date")

        data = []

        for employee in employees:
            data.append({
                "id": employee.id,
                "name": employee.name,
                "joining_date": employee.joining_date,
            })

        return JsonResponse(data, safe=False)


class ORMValuesView(View):

    def get(self, request):

        employees = Employee.objects.values(
            "name",
            "email",
            "salary"
        )

        return JsonResponse(
            list(employees),
            safe=False
        )

class ORMValuesListView(View):

    def get(self, request):
        employee_names = Employee.objects.values_list(
            "name",
            flat=True
        )
        return JsonResponse(
            list(employee_names),
            safe=False
        )


class ORMAnnotateView(View):

    def get(self,request):
        
        departments = Department.objects.annotate (employee_count=Count("employees"))

        data =[]

        for department in departments:
            data.append({
                "department":department.name,
                "employee_count":department.employee_count,
            })

        return JsonResponse(data, safe=False)
            
class ORMAnnotateSalaryView(View):

    def get(self,request):

        departments = Department.objects.annotate(
            avg_salary=Avg("employees__salary")
        )
    
        data=[]

        for department in departments:
            data.append({
                "department":department.name,
                "avg_salary":department.avg_salary,
            })

        return JsonResponse(data, safe=False)



class ORMAggregateView(View):
    
    def get(self,request):

        result=Employee.objects.aggregate(
            total_salary=Sum("salary"),
            Average=Avg("salary"),
            Maximum = Max("salary"),
            Minimum = Min("salary"),
        )
        return JsonResponse({
            "total_salary": str(result["total_salary"]),
            "average_salary": str(result["Average"]),
            "highest_salary": str(result["Maximum"]),
            "lowest_salary": str(result["Minimum"]),
        })


