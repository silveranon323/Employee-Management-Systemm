package com.project.ems.employee_management_system.controller;

import com.project.ems.employee_management_system.entity.Employee;
import com.project.ems.employee_management_system.service.EmployeeServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    @Autowired
    private EmployeeServiceImpl employeeService;


    @PostMapping
    public Employee createEmployee(@RequestBody Employee employee) {
        employeeService.createEmployee(employee);
        return employee;
    }


    @PostMapping("/bulk")
    public List<Employee> createEmployees(@RequestBody List<Employee> employees) {
        employeeService.createEmployees(employees);
        return employees;
    }


    @GetMapping
    public List<Employee> getEmployees() {
        return employeeService.getEmployees();
    }


    @GetMapping("/{id}")
    public Employee getEmployeeById(@PathVariable("id") Long employeeId) {
        return employeeService.getEmployeeById(employeeId);
    }


    @PutMapping
    public Employee updateEmployee(@RequestBody Employee employee) {
        return employeeService.updateEmployee(employee);
    }


    @DeleteMapping("/{id}")
    public String deleteEmployee(@PathVariable("id") Long employeeId) {
        employeeService.deleteEmployee(employeeId);
        return "Employee with ID " + employeeId + " deleted successfully.";
    }
}
