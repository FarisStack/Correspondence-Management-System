import SearchBox from "./SearchBox";
import SearchAccordion from "./SearchAccordion";
import { useState, useEffect } from "react";
import Card from "./Card";
import classes from "../css/ShowEmployees.module.css";
import axios from 'axios'

const ShowEmployees = () => {
    const [searchedInformation, setSearchedInformation] = useState({});
    const [searchButton, setSearchButton] = useState("normal");
    const [viewStaff, setViewStaff] = useState([]);
    const [staff, setStaff] = useState([]);
    const [Department, setDepartment] = useState([]);
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}employee/all`, {
            baseURL: process.env.REACT_APP_API_URL,
            headers: {
                employeeCurrentPositionId: localStorage.getItem('employeeCurrentPositionId'),
                'Content-type': 'application/json',
                Accept: 'application/json',
            },
            withCredentials: true, //XMLHttpRequest responses from a different domain cannot set cookie values for their own domain unless withCredentials is set to true before making the request.

        }).then((response) => {

            const { employees, positionsList } = response.data;
            setViewStaff(employees);
            setStaff(employees);
            const departments = [];
            for (let i = 0; i < positionsList.length; ++i) {
                departments.push({
                    'label': positionsList[i].description,
                    'value': positionsList[i].description
                });
            }
            setDepartment(departments);
        }).catch((error) => console.log(error));
    }, []);

    useEffect(() => {
        let searchedEmployees = staff;
        if (searchButton === "search") {
            /* ========================== search by userName ========================= */

            if (searchedInformation.name !== "") {
                searchedEmployees = searchedEmployees.filter((element) =>
                    (element.firstName + " " + element.middleName + " " + element.lastName)
                        .toLowerCase()
                        .includes(searchedInformation.name.toLowerCase())
                );
            }

            if (searchedInformation.email !== "") {
                searchedEmployees = searchedEmployees.filter(
                    (element) =>
                        element.email === searchedInformation.email
                );
            }


            /* ========================== search by department ========================= */

            if (searchedInformation.department !== "") {
                searchedEmployees = searchedEmployees.filter(
                    (element) => element.departments.includes(searchedInformation.department)
                );
            }

            if (searchedInformation.maritalStatus !== "") {
                console.log(searchedEmployees);
                searchedEmployees = searchedEmployees.filter(
                    (element) => element.maritalStatus.toLowerCase() === searchedInformation.maritalStatus.toLowerCase()

                );
            }

            if (searchedInformation.gender !== "") {
                searchedEmployees = searchedEmployees.filter(
                    (element) => element.gender === searchedInformation.gender
                );
                console.log(5);
            }

            /* ========================== search by phoneNumber ========================= */

            if (searchedInformation.phoneNumber !== "") {
                searchedEmployees = searchedEmployees.filter(
                    (element) => element.phoneNumber === searchedInformation.phoneNumber
                );
            }
            if (searchedInformation.hireDate !== "") {
                searchedEmployees = searchedEmployees.filter(
                    (element) => element.hireDate === searchedInformation.hireDate
                );
            }

            /* ========================== search by keyword ========================= */
            if (searchedInformation.city !== "") {
                searchedEmployees = searchedEmployees.filter((element) =>
                    element.city
                        .toLowerCase()
                        .includes(searchedInformation.city.toLowerCase())
                );
            }
            setViewStaff(searchedEmployees);
        } else {
            setViewStaff(staff);
        }
    }, [searchButton, searchedInformation]);

    return (
        <div>
            <SearchAccordion
                setSearchedInformation={setSearchedInformation}
                setSearchButton={setSearchButton}
                DepartmentOption={Department}
            />

            <div className={classes.container}>
                {viewStaff.map((currentEmployee, index) => (
                    <Card data={currentEmployee} key={index} />
                ))}
            </div>
        </div>
    );
};
export default ShowEmployees;
