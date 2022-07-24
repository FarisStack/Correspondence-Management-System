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
    workflowType: WorkflowType;  //`type` is reserved keyword in TpyeScript
    priority: WorkflowPriority;
    // creationDate: Date;
    // updateDate: Date;
}

export enum FilterByOptions {
    Keyword = "keyword",
    Employee = "employee",
    Date = "date",
    WorkflowType = "workflowType",
    WorkflowPriority = "workflowPriority",
    WorkflowSerial = "workflowSerial",
}

export enum EmployeeAs {
    Sender = "sender",
    Consignee = "consignee", // recipient/cc
    Either = "either" // either consignee (recipient/cc) or sender
}

export enum FolderTypes {
    All = "all",
    Inbox = "inbox",
    FollowUp = "follow-up",
    Cc = "cc"
}