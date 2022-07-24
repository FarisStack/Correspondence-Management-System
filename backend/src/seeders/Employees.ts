import { v4 as uuidv4 } from 'uuid'; //install @types/uuid if it exists

export const users = [
    {
        id: 1000,
        firstName: 'Faris',
        middleName: 'Hatem',
        lastName: "Abuali",
        email: "flawless.faris@gmail.com",
        phoneNumber: "0592566124",
        hireDate: "2022-03-04",
        userStatus: "regular",
        // privilegeGroup: "admin",
        role: "admin",
    },
    {
        id: 1001,
        firstName: 'Sponge',
        middleName: 'Bob',
        lastName: "SquarePants",
        email: "fareshatem.fh@outlook.com",
        phoneNumber: "0592566125",
        hireDate: "2022-03-05",
        userStatus: "regular",
        // privilegeGroup: "employee",
        role: "employee",
    },
];