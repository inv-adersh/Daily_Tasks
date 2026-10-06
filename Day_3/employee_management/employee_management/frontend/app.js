let employees = [];

async function loadEmployees() {

    const loading = document.getElementById("loading");
    const error = document.getElementById("error");

    try {

        loading.style.display = "block";
        error.textContent = "";

        const response = await fetch(
            "http://127.0.0.1:8006/employees/"
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        employees = await response.json();

        loading.style.display = "none";

        displayEmployees(employees);
        displayStatistics(employees);

    } catch (e) {

        loading.style.display = "none";

        error.textContent =
            "Failed to load employees.";

        console.error(e);
    }
}

loadEmployees();


function displayEmployees(employees) {

    const employeeList = document.getElementById("employee-list");
    employeeList.innerHTML = "";

    employees.forEach((employee) => {

        const {
            id,
            name,
            age,
            salary
        } = employee;

        const card = document.createElement("div");

        card.innerHTML = `
            <h2>${name}</h2>
            <p>Salary: ${salary}</p>
            <p>Age: ${age}</p>

            <button onclick="addFavorite(${id})">
            ${isFavorite(id) ? "Remove from Favorites" : "Add to Favorites"}
            </button>
        `;
        employeeList.appendChild(card);
    });
}

const searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", () => {

    const searchTerm = searchInput.value.toLowerCase();

    const filteredEmployees = employees.filter((employee) => {

        return employee.name
            .toLowerCase()
            .includes(searchTerm);

    });

    displayEmployees(filteredEmployees);
});


const salaryInput = document.getElementById("salary-input");

const sortSelect = document.getElementById("sort-select");

sortSelect.addEventListener("change", () => {

    const sortedEmployees = [...employees];

    if (sortSelect.value === "name") {

        sortedEmployees.sort((a, b) =>
            a.name.localeCompare(b.name)
        );

    } else if (sortSelect.value === "salary-low") {

        sortedEmployees.sort((a, b) =>
            Number(a.salary) - Number(b.salary)
        );

    } else if (sortSelect.value === "salary-high") {

        sortedEmployees.sort((a, b) =>
            Number(b.salary) - Number(a.salary)
        );
    }

    displayEmployees(sortedEmployees);
});


function displayStatistics(employees) {

    const totalEmployees = employees.length;

    const totalSalary = employees.reduce((total, employee) => {
        return total + Number(employee.salary);
    }, 0);

    const averageSalary =
        totalEmployees > 0
            ? totalSalary / totalEmployees
            : 0;

    const highestPaid = employees.reduce((highest, employee) => {

        return Number(employee.salary) > Number(highest.salary)
            ? employee
            : highest;

    }, employees[0]);

    document.getElementById("total-employees").textContent =
        totalEmployees;

    document.getElementById("total-salary").textContent =
        totalSalary;

    document.getElementById("average-salary").textContent =
        averageSalary.toFixed(2);

    document.getElementById("highest-paid").textContent =
        highestPaid ? highestPaid.name : "-";
}



function addFavorite(id) {

    let favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.includes(id)) {
        // Remove from favorites
        favorites = favorites.filter(fav => fav !== id);
    } else {
        // Add to favorites
        favorites.push(id);
    }

    localStorage.setItem(
        "favorites",
        JSON.stringify(favorites)
    );

    // Refresh cards to update button label
    displayEmployees(employees);
}

function isFavorite(id) {

    const favorites =
        JSON.parse(localStorage.getItem("favorites")) || [];

    return favorites.includes(id);
}


const usernameInput = document.getElementById("username-input");
const saveUsername = document.getElementById("save-username");
const welcomeMessage = document.getElementById("welcome-message");

saveUsername.addEventListener("click", () => {

    const username = usernameInput.value;

    sessionStorage.setItem("username", username);

    welcomeMessage.textContent = `Welcome, ${username}!`;
});

const savedUsername = sessionStorage.getItem("username");

if (savedUsername) {
    welcomeMessage.textContent = `Welcome back, ${savedUsername}!`;
}

function setSalaryCookie(salary) {
    document.cookie = `minimumSalary=${salary}; max-age=86400; path=/`;
}


function getSalaryCookie() {

    const cookies = document.cookie.split("; ");

    const salaryCookie = cookies.find(cookie =>
        cookie.startsWith("minimumSalary=")
    );

    if (!salaryCookie) {
        return "";
    }

    return salaryCookie.split("=")[1];
}


salaryInput.addEventListener("input", () => {

    const minimumSalary = Number(salaryInput.value);

    setSalaryCookie(salaryInput.value);

    const filteredEmployees = employees.filter((employee) => {

        return Number(employee.salary) >= minimumSalary;

    });

    displayEmployees(filteredEmployees);
});

const savedSalary = getSalaryCookie();

if (savedSalary) {
    salaryInput.value = savedSalary;
}




function checkEmployeeData() {

    return new Promise((resolve, reject) => {

        const hasData = employees.length > 0;

        if (hasData) {
            resolve("Employee data is available");
        } else {
            reject("No employee data available");
        }

    });
}
n

checkEmployeeData()
    .then((message) => {
        console.log(message);
    })
    .catch((error) => {
        console.error(error);
    });