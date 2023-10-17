import './App.css';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import { AIR_FLOW_MONITOR_URL } from './apiConfig';

function App() {
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');

  useEffect(() => {
    if (isDropdownOpen) {
      fetchBuildings();
    }
  }, [isDropdownOpen]);

  const handleBuildingChoise = (e) =>{
    setSelectedBuilding(e.target.value)
    fetchEmployees();
  }

  const handleSelectClick = () => {
    setIsDropdownOpen(true);
  };

  const fetchBuildings = () => {
    fetch(`${AIR_FLOW_MONITOR_URL}/building/get-all`, {
      method: 'GET', 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setBuildingOptions(data);
      })
      .catch((error) => {
        console.error('Error while fetching buildings:', error);
      });
  };

  const fetchEmployees = () => {
    fetch(`${AIR_FLOW_MONITOR_URL}/employee/get-all-dto-by-building_id/1`, {
      method: 'GET', 
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setEmployeeOptions(data);
      })
      .catch((error) => {
        console.error('Error while fetching employees:', error);
      });
  };

  return (
    <div className="container-main">
        <div className="left-half">
          <div className='building-div'>
            Choose building:
            <Form.Select
            className='select-light'
            value={selectedBuilding}
            onChange={(e) => handleBuildingChoise(e)}
            onClick={handleSelectClick}
          >
          <option value="">Select Building</option>
          {buildingOptions.map((building) => (
            <option key={building.id} value={building.name}>
              {building.name}
            </option>
            ))}
          </Form.Select>
          </div>
          <h1>Check-in</h1>
          <h3>Choose the employee</h3>
          <Form.Select
            className='select-light'
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
          <option value="">Select Employee</option>
          {employeeOptions.map((employee) => (
            <option key={employee.id} value={employee.name}>
              {employee.name}
            </option>
            ))}
          </Form.Select>
          <br/>
          <Button variant="outline-primary" className='button-light'>Check-in</Button>
        </div>
        <div className="right-half">
          <h1>Check-out</h1>
          <h3>Choose the employee</h3>
          <Form.Select
            className='select-light'
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
          <option value="">Select Employee</option>
          {employeeOptions.map((employee) => (
            <option key={employee.id} value={employee.name}>
              {employee.name}
            </option>
            ))}
          </Form.Select>
          <br/>
          <Button variant="outline-primary" className='button-dark'>Check-out</Button>
        </div>
    </div>
  );
}

export default App;
