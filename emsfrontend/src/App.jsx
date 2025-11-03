import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X, Filter, Download, Users } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/v1/employees';

export default function EmployeeManagementSystem() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState({
    employeeId: null,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    designation: '',
    department: '',
    salary: '',
    dateOfJoining: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, filterDept, filterStatus]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      alert('Failed to fetch employees. Make sure your backend is running on localhost:8080');
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = [...employees];

    if (searchTerm) {
      filtered = filtered.filter(emp =>
        emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterDept !== 'all') {
      filtered = filtered.filter(emp => emp.department === filterDept);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(emp => emp.status === filterStatus);
    }

    setFilteredEmployees(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const employeeData = {
        ...currentEmployee,
        salary: parseFloat(currentEmployee.salary)
      };

      if (isEditMode) {
        const response = await fetch(API_URL, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employeeData)
        });
        const updated = await response.json();
        setEmployees(employees.map(emp => 
          emp.employeeId === updated.employeeId ? updated : emp
        ));
        alert('Employee updated successfully!');
      } else {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employeeData)
        });
        const newEmployee = await response.json();
        setEmployees([...employees, newEmployee]);
        alert('Employee added successfully!');
      }

      closeModal();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Failed to save employee');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    setLoading(true);
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setEmployees(employees.filter(emp => emp.employeeId !== id));
      alert('Employee deleted successfully!');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (employee = null) => {
    if (employee) {
      setCurrentEmployee(employee);
      setIsEditMode(true);
    } else {
      setCurrentEmployee({
        employeeId: null,
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        designation: '',
        department: '',
        salary: '',
        dateOfJoining: '',
        status: 'Active'
      });
      setIsEditMode(false);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentEmployee({
      employeeId: null,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      designation: '',
      department: '',
      salary: '',
      dateOfJoining: '',
      status: 'Active'
    });
  };

  const departments = [...new Set(employees.map(emp => emp.department))];
  const statuses = [...new Set(employees.map(emp => emp.status))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Employee Management
                </h1>
                <p className="text-slate-600 text-sm mt-1">Manage your workforce efficiently</p>
              </div>
            </div>
            <button
              onClick={() => openModal()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Add Employee
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Employees</p>
                <p className="text-3xl font-bold text-slate-800 mt-2">{employees.length}</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Active</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {employees.filter(e => e.status === 'Active').length}
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <div className="w-8 h-8 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Departments</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{departments.length}</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-xl">
                <Filter className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Salary</p>
                <p className="text-3xl font-bold text-indigo-600 mt-2">
                  ${employees.length > 0 ? (employees.reduce((sum, e) => sum + e.salary, 0) / employees.length).toFixed(0) : 0}
                </p>
              </div>
              <div className="p-4 bg-indigo-100 rounded-xl">
                <Download className="w-8 h-8 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="all">All Status</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <Users className="w-16 h-16 mb-4" />
              <p className="text-xl font-semibold">No employees found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Salary</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.employeeId} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{employee.employeeId}</td>
                      <td className="px-6 py-4 text-sm text-slate-900 font-medium">
                        {employee.firstName} {employee.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.email}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{employee.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-900">{employee.designation}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {employee.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        ${employee.salary.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          employee.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openModal(employee)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.employeeId)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold text-slate-800">
                {isEditMode ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={currentEmployee.firstName}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, firstName: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={currentEmployee.lastName}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, lastName: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={currentEmployee.email}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, email: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={currentEmployee.phoneNumber}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, phoneNumber: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Designation</label>
                  <input
                    type="text"
                    required
                    value={currentEmployee.designation}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, designation: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Department</label>
                  <input
                    type="text"
                    required
                    value={currentEmployee.department}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, department: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Salary</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={currentEmployee.salary}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, salary: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Date of Joining</label>
                  <input
                    type="date"
                    required
                    value={currentEmployee.dateOfJoining}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, dateOfJoining: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select
                    required
                    value={currentEmployee.status}
                    onChange={(e) => setCurrentEmployee({...currentEmployee, status: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : isEditMode ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}