const apiBaseUrl = "http://localhost:8080/api/v1/employees";

async function fetchEmployees() {
  try {
    const res = await fetch(apiBaseUrl);
    if (!res.ok) throw new Error("Failed to fetch employees");
    const data = await res.json();
    displayEmployees(data);
  } catch (err) {
    console.error("Error fetching employees:", err);
  }
}

function displayEmployees(employees) {
  const tableBody = document.getElementById("employeeTableBody");
  tableBody.innerHTML = "";

  employees.forEach(emp => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.employeeId}</td>
      <td>${emp.firstName}</td>
      <td>${emp.lastName}</td>
      <td>${emp.email}</td>
      <td>${emp.phoneNumber}</td>
      <td>${emp.designation}</td>
      <td>${emp.department}</td>
      <td>${emp.salary}</td>
      <td>${emp.dateOfJoining}</td>
      <td>${emp.status}</td>
      <td>
        <button onclick="editEmployee(${emp.employeeId})">Edit</button>
        <button onclick="deleteEmployee(${emp.employeeId})">Delete</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

document.getElementById("employeeForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const employee = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    phoneNumber: document.getElementById("phoneNumber").value,
    designation: document.getElementById("designation").value,
    department: document.getElementById("department").value,
    salary: parseFloat(document.getElementById("salary").value),
    dateOfJoining: document.getElementById("dateOfJoining").value,
    status: document.getElementById("status").value
  };

  try {
    await fetch(apiBaseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee)
    });
    fetchEmployees();
    e.target.reset();
  } catch (err) {
    console.error("Error saving employee:", err);
  }
});

async function deleteEmployee(id) {
  if (!confirm("Are you sure you want to delete this employee?")) return;
  try {
    await fetch(`${apiBaseUrl}/${id}`, { method: "DELETE" });
    fetchEmployees();
  } catch (err) {
    console.error("Error deleting employee:", err);
  }
}

async function editEmployee(id) {
  try {
    const res = await fetch(`${apiBaseUrl}/${id}`);
    const emp = await res.json();

    document.getElementById("firstName").value = emp.firstName;
    document.getElementById("lastName").value = emp.lastName;
    document.getElementById("email").value = emp.email;
    document.getElementById("phoneNumber").value = emp.phoneNumber;
    document.getElementById("designation").value = emp.designation;
    document.getElementById("department").value = emp.department;
    document.getElementById("salary").value = emp.salary;
    document.getElementById("dateOfJoining").value = emp.dateOfJoining;
    document.getElementById("status").value = emp.status;
    document.getElementById("employeeId").value = emp.employeeId;
  } catch (err) {
    console.error("Error editing employee:", err);
  }
}

window.onload = fetchEmployees;
