attendance = {
    "Arun": ["P", "P", "A", "P", "P"],
    "Anand": ["A", "P", "A", "A", "P"],
    "John": ["P", "P", "P", "P", "P"],
    "Rahul":["A", "A", "P", "A", "P"]
}

def calculate_no_of_present_days(records):
    return records.count("P")


def calculate_attendance_percentage(records):
    days=len(records)

    if days == 0:
        return 0
    
    present_days=calculate_no_of_present_days(records)
    return (present_days/days)*100



def attendance_below_75(attendance):
    below_75=[]

    for employee,records in attendance.items():
        percentage=calculate_attendance_percentage(records)
        if percentage<75:
            below_75.append(employee)   

    return below_75


def highest_attendance(attendance):
    h_employee = None
    h_percentage = 0

    for employee, records in attendance.items():
        percentage = calculate_attendance_percentage(records)
        if percentage > h_percentage:
            h_percentage = percentage
            h_employee = employee

    return h_employee, h_percentage

def categorize_attendance(percentage):
    if percentage >= 90:
        return "Excellent"
    elif percentage >= 75:
        return "Good"
    else:
        return "Needs Improvement"


def display_report(attendance):
    print(" \n Attendance Report \n ")
    for employee, records in attendance.items():
        present_days = calculate_no_of_present_days(records)
        percentage = calculate_attendance_percentage(records)
        category = categorize_attendance(percentage)
        print(f"{employee}: {present_days} present days, {percentage:.2f}%, {category}")

    below_75 = attendance_below_75(attendance)
    print("\nEmployees with attendance below 75%:")
    for employee in below_75:
        print(f"- {employee}")

    highest_employee, highest_percentage = highest_attendance(attendance)
    print(
        f"\nHighest attendance: "
        f"{highest_employee} - "
        f"{highest_percentage:.2f}%"
    )

def main():
    display_report(attendance)

if __name__ == "__main__":
    main()