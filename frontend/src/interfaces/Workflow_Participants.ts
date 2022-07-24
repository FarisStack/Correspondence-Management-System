export enum ConsigneeTypes {
    DIRECT_RESPONSIBLE = "DIRECT RESPONSIBLE", // singular
    COLLEAGUE = "COLLEAGUES", // COLLEAGUE(S) because they are plural (many colleagues)
    STAFF = "STAFF", // also plural
    CUSTOM_GROUP = "MY GROUPS", // plural because the employee can have multiple custom groups
    WORKFLOW_PARTICIPANT = "WORKFLOW PARTICIPANT", //person who I cannot contact with (He is neither my direct responsible, nor my colleague, nor one of my staff; but since we participated in the same workflow, then we are allowed to send to each other only in workflows that we share)
}