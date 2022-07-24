import { EmployeeAttributes } from './Employee'

export interface EmployeePositionAttributes {
    id: number;
    // empId: UserAttributes["id"]; //references the id field in `User` model

    positionId: number;  //references the positionId field in `Hierarchy` model
    classification: positionClassifications;
    //classificcation inside the position, will be enum of classification
    jobTitleId: number;

    startDate: Date;
    endDate: Date | undefined;
    //endDate field is nullable, because when endDate field is null in a record
    //then this record means that this employee is still on his position
}

export enum positionClassifications {
    RESPONSIBLE = "responsible",
    SUBORDINATE = "subordinate",
    // subordinate = a person under the authority or control of another within an organization.
    SECRETARY = "secretary"
}

