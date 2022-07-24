import axiosInstance from "../../../api/axios";
import { AxiosResponse } from "axios"
// ----------------- Snackbar -------------------
import { setSnackbar } from "../../../store/slices/snackbarSlice";

export const uploadNewWorkflowFiles = (payload: any) => {
    // ------------------ Uploading Files to Server -----------------------
    const formData = new FormData(); // JavaScript built-in class

    // const workflowId = payload?.newWorkflowId;
    // const actionId = payload?.newActionId;

    // destructure the payload param:
    const { 
        myFiles,
        newActionId,
        newWorkflowId,
        dispatch, 
        setIsOpen,
        setFilesFeedbackList
    } = payload;


    myFiles.forEach((file: any) => {
        // console.log(file.fileInfo);
        formData.append('workflowFiles', file.fileInfo)
        //'workflowFiles' is any name we want to pass with the request
    });

    formData.append("actionId", newActionId.toString()); // will be accessed through req.body
    formData.append("workflowId", newWorkflowId.toString()); // will be accessed through req.body

    console.log(formData.getAll("workflowFiles"));

    axiosInstance().post("workflow/create/uploadFiles", formData, {
        headers: { 'Content-Type': "multipart/form-data" },
        withCredentials: true,
    }).then((response: any) => {
        const { feedbackList, message } = response.data;
        console.log(response.data);
        setFilesFeedbackList(feedbackList);
        setIsOpen(true); //open the fileFeedbackDialog
    }).catch(error => {
        console.log(error.message);
        dispatch(
            setSnackbar({
                snackbarOpen: true,
                snackbarMessage: error.message,
                snackbarType: "error"
            })
        );
    });
    // ------------------ Done Uploading Files to Server -----------------------
}

export const createNewWorkflow = async (payload: any, dispatch: any): Promise<AxiosResponse<any, any> | undefined> => {
    const { workflowType, workflowPriority, recipients, cc, subject, richTextContent } = payload;

    try {
        const response = await axiosInstance().post("workflow/create",
            {
                workflowType,
                priority: workflowPriority,
                subject,
                recipients,
                cc,
                richTextContent
            },
            {
                headers: { 'Content-Type': "application/json" },
                withCredentials: true,
            }
        );
        // console.log(response.data);
        dispatch(
            setSnackbar({
                snackbarOpen: true,
                snackbarMessage: response.data.message,
                snackbarType: "success",
                autoHideDuration: 4000
            })
        );
        return response;
    }
    catch (error: any) {
        console.log(error?.message);
        dispatch(
            setSnackbar({
                snackbarOpen: true,
                snackbarMessage: error.message,
                snackbarType: "error"
            })
        );
    }
}