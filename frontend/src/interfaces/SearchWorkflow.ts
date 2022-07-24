export enum FolderType {
    All = "all",
    Inbox = "inbox",
    FollowUp = "follow-up",
    Cc = "cc"
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

