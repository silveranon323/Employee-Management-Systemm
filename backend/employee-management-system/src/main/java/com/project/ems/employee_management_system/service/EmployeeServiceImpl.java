package com.project.ems.employee_management_system.service;

import com.project.ems.employee_management_system.entity.Employee;
import com.project.ems.employee_management_system.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeServiceImpl implements EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;


    @Override
    public void createEmployee(Employee employee) {

        employee.setEmployeeId(null);
        employeeRepository.save(employee);
    }


    @Override
    public void createEmployees(List<Employee> employees) {

        employees.forEach(emp -> emp.setEmployeeId(null));
        employeeRepository.saveAll(employees);
    }

    @Override
    public Employee getEmployeeById(Long employeeId) {
        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + employeeId));
    }


    @Override
    public List<Employee> getEmployees() {
        return employeeRepository.findAll();
    }


    @Override
    public Employee updateEmployee(Employee employee) {
        Employee existing = employeeRepository.findById(employee.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with ID: " + employee.getEmployeeId()));

        existing.setFirstName(employee.getFirstName());
        existing.setLastName(employee.getLastName());
        existing.setEmail(employee.getEmail());
        existing.setPhoneNumber(employee.getPhoneNumber());
        existing.setDesignation(employee.getDesignation());
        existing.setDepartment(employee.getDepartment());
        existing.setSalary(employee.getSalary());
        existing.setDateOfJoining(employee.getDateOfJoining());
        existing.setStatus(employee.getStatus());

        return employeeRepository.save(existing);
    }


    @Override
    public void deleteEmployee(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new RuntimeException("Cannot delete. Employee not found with ID: " + employeeId);
        }
        employeeRepository.deleteById(employeeId);
    }
}
