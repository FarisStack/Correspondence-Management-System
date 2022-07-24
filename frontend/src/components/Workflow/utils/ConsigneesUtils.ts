// ------------- MUI Colors ------------------------
import { teal, red, blue, purple, pink, green, orange, brown } from '@mui/material/colors';

// ------ TS Interfaces ------------------
import { WorkflowType, WorkflowPriority } from "../../../interfaces/Workflow";
import { ConsigneeTypes } from "../../../interfaces/Workflow_Participants";

export const prepareSelectedConsignees = (selectedOptions: any[], listOfConsignees: any[]): any[] => {
    // param1: `selectedOptions` is a list of all selected options received from the MUI Autocomplete.
    // param2: `listOfConsignees`: This is all available consignees received as a response from the server.

    // Returns a prepared list of all consignees the user selected:

    // 1. Map over the `selectedOptions` array to search for groups if exist:
    let selectedGroupIDs: any = []; //memberIds of the selected groups
    // const groupMembersIDs = new Set();

    selectedOptions = selectedOptions.filter((sOption) => {
        if (sOption.consigneeType === ConsigneeTypes.CUSTOM_GROUP) {
            // then sOption is a group, not single person:
            // 1. Add all the group members to the `groupMembersIDs` list:
            selectedGroupIDs = sOption.groupMembers;
            console.log("groupMembersIDs: ", selectedGroupIDs);
            // 2. Don't return the sOption object because it is not needed anymore:
            // (I don't need the group itself, I need the members inside it)
        }
        else {
            return sOption; //return the object sOption as it is
        }
    });
    // Iterate over the `listOfConsignees` and push the consignees who were selected via clicking on a custom group:
    listOfConsignees.forEach((consignee: any) => {
        if (
            consignee.consigneeType !== ConsigneeTypes.CUSTOM_GROUP &&
            selectedGroupIDs.includes(consignee.id)
        ) {
            selectedOptions.push(consignee);
        }
    });

    // ------------------------------------------------------------------
    // Remember: The same person may be a member of two groups for example, and if the user has selected the 2 groups, the person who is member of the two groups will be added to the `selectedOptions` list twice! So we must iterate over the selectedOptions` list and remove duplicates to ensure that each person is selected once:
    let alreadyChosenIDs: any[] = [];
    let selectedOptionsUNIQUE: any[] = selectedOptions.filter((person: any) => {
        if (alreadyChosenIDs.includes(person.id) === false) {
            alreadyChosenIDs.push(person.id);
            return person;
        }
    });

    return selectedOptionsUNIQUE;
}
export const colorizeBasedOnConsigneeType = (consignee: any) => {
    return consignee.consigneeType === ConsigneeTypes.CUSTOM_GROUP
        ? pink[600]
        : consignee.consigneeType === ConsigneeTypes.WORKFLOW_PARTICIPANT
            ? purple[500]
            : consignee.consigneeType === ConsigneeTypes.DIRECT_RESPONSIBLE
                ? orange[500]
                : consignee.consigneeType === ConsigneeTypes.COLLEAGUE
                    ? blue[700]
                    : consignee.consigneeType === ConsigneeTypes.STAFF
                        ? teal[400]
                        : "black"
}