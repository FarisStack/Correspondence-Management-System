import React, { Fragment, useState, useEffect } from 'react'
// ===== Libraries needed to deal with TextEditor.js: 
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// ============= Our Components: ===================
import FormFields from './FormFields';
import TextEditor from './TextEditor';
import Attachment from './Attachment';
import FileFeedbackDialog from '../Actions/NewAction/FileFeedbackDialog';
// ------------------ MUI -----------------------
import Button from '@mui/material/Button';
// =============== Our Styles ======================
import classes from "./css/CreateWorkflow.module.css";
// ------------------ Axios -------------------------
import axiosInstance from "../../../api/axios";
// ------------------- API Functions ------------------
import { uploadNewWorkflowFiles, createNewWorkflow } from "../api/createWorkflowAPI";
// ----------------- Snackbar -------------------
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../../store/slices/snackbarSlice";

// ------ TS Interfaces ------------------
import { WorkflowType, WorkflowPriority } from "../../../interfaces/Workflow";


const initialValues = {
  workflowType: WorkflowType.INTERNAL_CORRESPONDENCE,
  workflowPriority: WorkflowPriority.MEDIUM,
  workflowSubject: "",
  recipientsSelect: [],
  ccSelect: [],
  richTextState: EditorState.createEmpty(),
  myFiles: [],
}

function CreateWorkflow() {

  useEffect(() => {
    axiosInstance().get("workflow/toWhomCanISendNewWorkflow").then((response) => {
      const { availableConsignees } = response.data;
      console.log(response.data);
      setListOfConsignees(availableConsignees)
    });
  }, []);

  const dispatch = useDispatch();

  // ============ States for `FormFields.js` =========
  const [workflowType, setWorkflowType] = useState<WorkflowType>(WorkflowType.INTERNAL_CORRESPONDENCE);
  const [workflowPriority, setWorkflowPriority] = useState<WorkflowPriority>(WorkflowPriority.MEDIUM);
  const [subject, setSubject] = useState<string>('');
  const [recipients, setRecipients] = useState([]);
  const [cc, setCc] = useState([]);
  const [listOfConsignees, setListOfConsignees] = useState<Array<any>>([]);
  // ============ States for `TextEditor.js` =========
  let editorState = EditorState.createEmpty();
  const [richTextState, setRichTextState] = useState(editorState); // object
  // ============ States for `Attachment.js` =========
  const [myFiles, setMyFiles] = useState([]);
  // ============ States for `FileFeedbackDialog.js` =========
  const [isOpen, setIsOpen] = useState(false);
  const [filesFeedbackList, setFilesFeedbackList] = useState([]);

  // === These states for preventing the same person being added as a recipient and as a CC
  const [ccIDS, setCcIDs] = useState<Array<number>>([]);
  const [recipientsIDs, setRecipientsIDs] = useState<Array<number>>([]);

  const validate = () => {
    const richTextContent = draftToHtml(convertToRaw(richTextState.getCurrentContent()));
    if (subject === "" || recipients.length === 0) {
      return false;
    }
    else if (richTextContent.toString().length <= 8) {
      return false;
    }
    return true;
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    e.persist();

    const isValid = validate();
    if (!isValid) {
      dispatch(
        setSnackbar({
          snackbarOpen: true,
          snackbarMessage: "Please fill all required fields: type, subject, recipients, and the message content",
          snackbarType: "error"
        })
      );
    }
    else {
      // ------------------ Creating New Workflow (Application/json) -----------------
      const richTextContent = draftToHtml(convertToRaw(richTextState.getCurrentContent()));
      const response = await createNewWorkflow({
        workflowType, workflowPriority, subject, recipients, cc, richTextContent
      }, dispatch);
      console.log(response?.data);
      const { newWorkflowId, newActionId } = response?.data;
      // ------------------ Done Creating New Workflow -------------------------------
      // ------------------ Uploading Files to Server (multipart/form-data) ----------
      if (myFiles.length > 0) {
        // uploadNewWorkflowFiles(myFiles, { newWorkflowId, newActionId }, dispatch);
        uploadNewWorkflowFiles({
          myFiles,
          newWorkflowId,
          newActionId,
          dispatch,
          setIsOpen,
          setFilesFeedbackList
        });
      }
      // ------------------ Done Uploading Files to Server ---------------------------
      setWorkflowType(initialValues.workflowType);
      setWorkflowPriority(initialValues.workflowPriority);
      setSubject(initialValues.workflowSubject);
      setRecipients(initialValues.recipientsSelect);
      setCc(initialValues.ccSelect);
      setRichTextState(initialValues.richTextState);
      setMyFiles(initialValues.myFiles);
      setRecipientsIDs([]);
      setCcIDs([]);
    }
  }// end function handleSubmit

  return (

    <form
      className={classes["create-workflow-container"]}
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className={classes.merge}>
        <h1 className={classes["page-h1"]}>Create new workflow</h1>
        <FormFields
          workflowType={workflowType}
          setWorkflowType={setWorkflowType}
          workflowPriority={workflowPriority}
          setWorkflowPriority={setWorkflowPriority}
          subject={subject}
          setSubject={setSubject}
          recipients={recipients}
          setRecipients={setRecipients}
          cc={cc}
          setCc={setCc}
          listOfConsignees={listOfConsignees}
          setListOfConsignees={setListOfConsignees}
          recipientsIDs={recipientsIDs}
          setRecipientsIDs={setRecipientsIDs}
          ccIDS={ccIDS}
          setCcIDs={setCcIDs}
        />
        <TextEditor
          richTextState={richTextState}
          setRichTextState={setRichTextState}
        />
        <Attachment myFiles={myFiles} setMyFiles={setMyFiles} />


        <div className={classes.submitBtnContainer}>
          <Button
            // className={classes.btnTheme}
            // onClick={handleSubmit}
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Submit
          </Button>
        </div>

        <FileFeedbackDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          filesFeedbackList={filesFeedbackList}
          setFilesFeedbackList={setFilesFeedbackList}
        />
      </div>
      {/* End div whose className={classes.merge} */}
    </form>
  )
}

export default CreateWorkflow