import axiosInstance from "../../../api/axios";
import { AxiosResponse } from "axios"
// ----------------- Snackbar -------------------
import { setSnackbar } from "../../../store/slices/snackbarSlice";



export const getActionsByWorkflowId = ({
    workflowId, cameFromActionId, mounted, setForbidden, setMessage,
    setWorkflowInfo, setWorkflowActions, setAllActionsAttachments, setMyEmployeePositionId
}: any) => {
    axiosInstance().get(
        `action/getActionsByWorkflowId?workflowId=${workflowId}&cameFromActionId=${cameFromActionId}`
    ).then((response) => {
        const { status, message } = response.data;
        if (mounted && status === 403) {
            // navigate("/inbox");
            setForbidden(true);
            setMessage(message);
        }
        else if (mounted && status === 200) {
            setForbidden(false);
            const { actions, workflowInfo, allActionsAttachments, myEmpPositionId } = response.data;
            // console.log("ACTIONS: ", actions);
            // console.log("INFO: ", workflowInfo);
            setWorkflowInfo(workflowInfo);
            setWorkflowActions(actions);
            setAllActionsAttachments(allActionsAttachments);
            setMyEmployeePositionId(Number(myEmpPositionId));
        }
    }).catch((error: any) => console.log(error.message));
}

export const createNewAction = async (payload: any): Promise<any> => {

    const { workflowId, recipients, cc, richTextContent, dispatch } = payload;

    try {
        const response = await axiosInstance().post("action/create",
            {
                recipients, cc, richTextContent, workflowId
            },
            // {
            //     headers: { 'Content-Type': "application/json" },
            //     withCredentials: true,
            // }
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
    return new Promise<any>((resolve, reject) => { resolve("done") })
}

export const uploadNewActionFiles = (payload: any) => {
    const { myFiles, newActionId, workflowId, dispatch, setIsOpen, setFilesFeedbackList } = payload;
    // ------------------ Uploading Files to Server -----------------------
    const formData = new FormData(); // JavaScript built-in class


    myFiles.forEach((file: any) => {
        // console.log(file.fileInfo);
        formData.append('actionFiles', file.fileInfo)
        //'actionFiles' is any name we want to pass with the request
    });

    formData.append("actionId", newActionId.toString()); // will be accessed through req.body
    formData.append("workflowId", workflowId.toString()); // will be accessed through req.body

    // console.log(formData.getAll("actionFiles"));

    axiosInstance().post("action/create/uploadFiles", formData, {
        headers: { 'Content-Type': "multipart/form-data" },
        // withCredentials: true,
    }).then((response: any) => {
        const { feedbackList, message } = response.data;
        console.log(response.data);
        setFilesFeedbackList(feedbackList);
        setIsOpen(true); //open the fileFeedbackDialog
    }).catch((error: any) => {
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