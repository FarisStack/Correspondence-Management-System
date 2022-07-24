export interface EmployeeAttributes {
    id: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    avatar: string | undefined;  //store the profile_photo name (path) as string.
    // Avatar is nullable (can be null)
    phoneNumber: string;
    hireDate: Date;
    birthDate: Date;
    gender: string;
    maritalStatus: MaritalStatus;
    city: string;
    userStatus: EmployeeStatus;
    // privilegeGroup: PrivilegeGroup;
    role: Role
}

export enum EmployeeStatus {
    REGULAR = "regular",
    IN_VACATION = "in-vacation",
    RETIRED = "retired",
    FIRED = "fired",
    RESIGNED = "resigned",
}
// export enum PrivilegeGroup {
//     // FULL_TIME_EMPLOYEE = "full-time-employee",
//     // PART_TIME_EMPLOYEE = "part-time-employee",
//     EMPLOYEE = "employee",
//     ADMIN = "admin",
//     MODERATOR = "moderator",
// }

export enum Role {
    // FULL_TIME_EMPLOYEE = "full-time-employee",
    // PART_TIME_EMPLOYEE = "part-time-employee",
    EMPLOYEE = "employee",
    ADMIN = "admin",
    MODERATOR = "moderator",
}

export enum MaritalStatus {
    SINGLE = "single",
    MARRIED = "married",
    DIVORCED = "divorced",
    WIDOWED = "widowed",
    OTHER = "other"
}