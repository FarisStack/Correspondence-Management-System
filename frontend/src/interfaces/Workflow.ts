export enum WorkflowType {
    INTERNAL_CORRESPONDENCE = "Internal Correspondence",
    EXTERNAL_CORRESPONDENCE_INCOMING = "External Correspondence - Incoming",
    EXTERNAL_CORRESPONDENCE_OUTGOING = "External Correspondence - Outgoing",
    LETTER = "Letter",
    DECISION = "Decision",
    REPORT = "Report",
    INSTRUCTIONS = "Instructions",
    INVITATION = "Invitation",
}
export enum WorkflowPriority {
    URGENT = "Urgent",
    HIGH = "High",
    MEDIUM = "Medium",
    LOW = "Low",
}

export interface WorkflowAttributes {
    id: number;
    subject: string;
    workflowType: WorkflowType;  //`type` is reserved keyword in TypeScript
    priority: WorkflowPriority;
    // creationDate: Date;
    // updateDate: Date;
}

export enum TableTypes {
    INBOX = "inbox",
    FOLLOW_UP = "follow-up",
    CC = "cc"
}
export const tableNames: string[] = [
    TableTypes.INBOX, TableTypes.FOLLOW_UP, TableTypes.CC
];
