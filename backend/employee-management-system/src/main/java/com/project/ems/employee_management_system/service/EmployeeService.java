package com.project.ems.employee_management_system.service;

import com.project.ems.employee_management_system.entity.Employee;

import java.util.List;

public interface EmployeeService {
        public void createEmployee(Employee employee);
        public Employee getEmployeeById(Long employeeId);
        public void createEmployees(List<Employee> employees);
        public List<Employee> getEmployees();
        public Employee updateEmployee(Employee employee);
        public void deleteEmployee(Long employeeId);
}
