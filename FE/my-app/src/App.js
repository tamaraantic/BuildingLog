import "./App.css";
import { Form } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect } from "react";
import { AIR_FLOW_MONITOR_URL, BUILDING_LOG_URL } from "./apiConfig";
import CreateInOutEvent from "./model/InOutEventRequest";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);

  const [employees, setEmployees] = useState([]);
  const [inOutEvents, setInOutEvents] = useState([]);

  const [employeeOptionsIn, setEmployeeOptionsIn] = useState([]);
  const [selectedEmployeeIn, setSelectedEmployeeIn] = useState("");

  const [employeeOptionsOut, setEmployeeOptionsOut] = useState([]);
  const [selectedEmployeeOut, setSelectedEmployeeOut] = useState("");

  useEffect(() => {
    if (isDropdownOpen) {
      fetchBuildings();
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedBuilding !== "") {
        const data = await fetchEmployees();
        const inOutEventEmployeeMap = {};
        for (const event of await fetchEmployeesIn()) {
          inOutEventEmployeeMap[event.employeeId] = event;
        }

        const newEmployeeOptionsIn = data.filter(
          (emp) => !inOutEventEmployeeMap[emp.id]
        );
        const newEmployeeOptionsOut = data.filter(
          (emp) => inOutEventEmployeeMap[emp.id]
        );

        setEmployeeOptionsIn(newEmployeeOptionsIn);
        setEmployeeOptionsOut(newEmployeeOptionsOut);
      }
    };
    fetchData();
  }, [selectedBuilding]);

  const handleBuildingChoice = (e) => {
    if (e && e.target && e.target.value) {
      setSelectedBuilding(e.target.value);
    }
    setEmployeeOptionsIn([]);
    setEmployeeOptionsOut([]);
  };

  const handleSelectClick = () => {
    setIsDropdownOpen(true);
    setEmployeeOptionsIn([]);
    setEmployeeOptionsOut([]);
  };

  const fetchBuildings = () => {
    fetch(`${AIR_FLOW_MONITOR_URL}/building/get-all`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => setBuildingOptions(data))
      .catch((error) =>
        console.error("Error while fetching buildings:", error)
      );
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `${AIR_FLOW_MONITOR_URL}/employee/get-all-dto-by-building_id/${selectedBuilding}`,
        { method: "GET" }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setEmployees(data);
      return data;
    } catch (error) {
      console.error("Error while fetching employees:", error);
      throw error;
    }
  };

  const fetchEmployeesIn = () => {
    return fetch(`${BUILDING_LOG_URL}/in-out-event/get-employees-inside`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        setInOutEvents(data);
        return data;
      })
      .catch((error) => {
        console.error("Error while fetching employees:", error);
        throw error;
      });
  };

  const sendInOutEvent = (employeeId, direction) => {
    const event = new CreateInOutEvent(employeeId, direction);

    fetch(`${BUILDING_LOG_URL}/in-out-event/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
    })
      .then((response) => {
        if (response.ok !== true) {
          throw new Error("Network response was not ok");
        } else {
          toast.success("Event successfully created!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
          });

          handleBuildingChoice();
          handleSelectClick();
        }
      })
      .catch((error) => {
        console.error("Error while sending the event:", error);
        toast.error("Error creating event. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
        });

        // Pozovite handleBuildingChoice s null argumentom
        handleBuildingChoice(null);
      });
  };

  return (
    <div className="container-main">
      <div className="left-half">
        <div className="building-div">
          Choose building:
          <Form.Select
            className="select-light"
            value={selectedBuilding}
            onChange={(e) => handleBuildingChoice(e)}
            onClick={handleSelectClick}
          >
            <option value="">Select Building</option>
            {buildingOptions.map((building) => (
              <option key={building.id} value={building.id}>
                {building.name}
              </option>
            ))}
          </Form.Select>
        </div>
        <h1>Check-in</h1>
        <h3>Choose the employee</h3>
        <Form.Select
          className="select-light"
          value={selectedEmployeeIn}
          onChange={(e) => setSelectedEmployeeIn(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employeeOptionsIn.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name} {employee.surname}
            </option>
          ))}
        </Form.Select>
        <br />

        <Button
          variant="outline-primary"
          className="button-light"
          onClick={() => {
            sendInOutEvent(selectedEmployeeIn, "in");
            setSelectedEmployeeIn("");
            fetchEmployeesIn().then((data) => {
              const inOutEventEmployeeMap = {};
              for (const event of data) {
                inOutEventEmployeeMap[event.employeeId] = event;
              }
              const newEmployeeOptionsIn = employees.filter(
                (emp) => !inOutEventEmployeeMap[emp.id]
              );
              const newEmployeeOptionsOut = employees.filter(
                (emp) => inOutEventEmployeeMap[emp.id]
              );
              setEmployeeOptionsIn(newEmployeeOptionsIn);
              setEmployeeOptionsOut(newEmployeeOptionsOut);
            });
          }}
        >
          Check-in
        </Button>
      </div>
      <div className="right-half">
        <h1>Check-out</h1>
        <h3>Choose the employee</h3>
        <Form.Select
          className="select-light"
          value={selectedEmployeeOut}
          onChange={(e) => setSelectedEmployeeOut(e.target.value)}
        >
          <option value="">Select Employee</option>
          {employeeOptionsOut.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.name} {employee.surname}
            </option>
          ))}
        </Form.Select>
        <br />
        <Button
          variant="outline-primary"
          className="button-dark"
          onClick={() => {
            sendInOutEvent(selectedEmployeeOut, "out");
            setSelectedEmployeeOut("");
            fetchEmployeesIn().then((data) => {
              const inOutEventEmployeeMap = {};
              for (const event of data) {
                inOutEventEmployeeMap[event.employeeId] = event;
              }
              const newEmployeeOptionsIn = employees.filter(
                (emp) => !inOutEventEmployeeMap[emp.id]
              );
              const newEmployeeOptionsOut = employees.filter(
                (emp) => inOutEventEmployeeMap[emp.id]
              );
              setEmployeeOptionsIn(newEmployeeOptionsIn);
              setEmployeeOptionsOut(newEmployeeOptionsOut);
            });
          }}
        >
          Check-out
        </Button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
