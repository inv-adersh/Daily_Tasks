performance_data ={
    "Arun": [85,90,78,92,88],
    "Anand": [60,70,65,75,80],
    "John": [95,92,98,96,94],
    "Rahul": [70,72,75,78,80]
}
PERFORMANCE_THRESHOLD = 75


def calculate_avg_score(scores):
    try:
        num = list(map(float, scores))
        length = len(num)
        total = sum(num)
        average = total / length

        return average

    except ZeroDivisionError:
        print("Error: Division by zero while calculating average.")
        return None
    except (TypeError, ValueError) as e:
        print(f"Error: Invalid score data encountered ({scores}): {e}")
        return None
    finally:
        pass


def calculate_all_averages(performance_data):

    employee_average={
        employee:calculate_avg_score(scores)
        for employee,scores in performance_data.items()
    }
    
    return employee_average

def high_performer(performance_data):
 
    high_employee = None
    high_average = float('-inf')

    for employee,scores in performance_data.items():
        average=calculate_avg_score(scores)

        if average > high_average:
            high_average=average
            high_employee=employee

    return high_employee, high_average


def second_highest(performance_data):
    highest_avg_employee= None
    second_highest_avg_employee = None

    highest_avg = float('-inf')
    second_highest_avg = float('-inf')

    for employee,scores in performance_data.items():
        average=calculate_avg_score(scores)

        if average > highest_avg:
            
            second_highest_avg = highest_avg
            second_highest_avg_employee = highest_avg_employee

            highest_avg = average
            highest_avg_employee = employee

        elif average > second_highest_avg:

            second_highest_avg = average
            second_highest_avg_employee = employee

    return second_highest_avg_employee, second_highest_avg


def find_below_threshold(performance_data, threshold):

    employee_average= calculate_all_averages(performance_data)
    
    filterred = filter(
                lambda x:x[1]<threshold,
                employee_average.items()
    )

    below_threshold= [employee for employee,average in filterred]
    
    return below_threshold


def performance_category(average):
    if average >= 90:
        return "Excellent"
    elif average >= 75:
        return "Good"
    elif average >= 60:
        return "Average"
    else:
        return "Needs Improvement"


def categorize_all_employees(averages):

    categories = {
        employee: performance_category(average)
        for employee,average in averages.items()
    }

    return categories


def main():

    averages = calculate_all_averages(performance_data)

    print("Employee Averages:")
    for employee,average in averages.items():
        print(f"- {employee}: {average}")

    highest_employee, highest_average = high_performer(performance_data)

    print("\nHighest Performing Employee:")
    print(highest_employee, highest_average)

    second_employee, second_average = second_highest(performance_data)

    print("\nSecond Highest Performing Employee:")
    print(second_employee, second_average)

    below_threshold = find_below_threshold(performance_data,PERFORMANCE_THRESHOLD)
    print("\nEmployees Below Threshold:")
    for employee in below_threshold:
        print(f"- {employee}")

    categories = categorize_all_employees(averages)
    print("\nEmployee Categories:")
    for employee,category in categories.items():
        print(f"- {employee}: {category}")


if __name__ == "__main__":
    main()