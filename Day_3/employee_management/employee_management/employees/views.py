from django.views import View
from django.shortcuts import render
from .models import Employee
from django.http import JsonResponse
import json 

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