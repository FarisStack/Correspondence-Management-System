import React, { Fragment, useState, useEffect } from 'react'
// ===== Libraries needed to deal with TextEditor.js: 
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
// ============= Our Components: ===================
import FormFields from './FormFields';
import TextEditor from './TextEditor';
import Attachment from './Attachment';
import FileFeedbackDialog from './FileFeedbackDialog';
// ------------------ MUI -----------------------
import Button from '@mui/material/Button';
// ------------------ MUI Icons -----------------------
import SendIcon from '@mui/icons-material/Send';

// ------------------ Axios -------------------------
import axiosInstance from "../../../../api/axios";
// ------------------- API Functions ------------------
import { createNewAction, uploadNewActionFiles } from "../../api/actionsAPI";

// ----------------- Snackbar -------------------
import { useDispatch } from "react-redux";
import { setSnackbar } from "../../../../store/slices/snackbarSlice";

import { useNavigate } from "react-router-dom";
// =============== Our Styles ======================
import classes from "../../CreateWorkflow/css/CreateWorkflow.module.css";

// ------ TS Interfaces ------------------

type NewActionProps = {
  workflowId: string | undefined;
}

const initialValues = {
  workflowSubject: "",
  recipientsSelect: [],
  ccSelect: [],
  richTextState: EditorState.createEmpty(),
  myFiles: [],
}

const CreateAction = ({ workflowId }: NewActionProps) => {

  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance().get(`action/toWhomCanIRespondWithNewAction?workflowId=${workflowId}`, {
      // withCredentials: true,
    }).then((response) => {
      const { availableConsignees } = response.data;
      console.log(response.data);
      setListOfConsignees(availableConsignees);
    });
  }, []);

  const dispatch = useDispatch();

  // ============ States for `FormFields.js` =========
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
    // Only recipients field is required. CC field and RichText Editor can be left empty
    if (recipients.length === 0) {
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
          snackbarMessage: "Please specify at least one recipient",
          snackbarType: "error"
        })
      );
    }
    else {
      // ------------------ Creating New Workflow (Application/json) -----------------
      const richTextContent = draftToHtml(convertToRaw(richTextState.getCurrentContent()));
      console.log("recipients: ", recipients);
      console.log("CC: ", cc);
      console.log("richTextContent: ", richTextContent);
      console.log("myFiles: ", myFiles);

      // ------------------ Creating New Action (Application/json) -----------------
      const response = await createNewAction({ workflowId, recipients, cc, richTextContent, dispatch });
      console.log(response?.data);
      const { newActionId } = response?.data;
      // ------------------ Done Creating New Action ✅ -------------------------------

      // ------------------ Uploading Files to Server (multipart/form-data) ----------
      if (myFiles.length > 0) {
        uploadNewActionFiles({
          myFiles, newActionId, workflowId, dispatch, setIsOpen, setFilesFeedbackList
        });
      }
      // ------------------ Done Uploading Files to Server ✅ ---------------------------

      // --- Reset all fields ----
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
      className={classes["create-workflow"]}
      onSubmit={(e) => handleSubmit(e)}
    >
      {/* <h1 className={classes["page-h1"]}>Add new action</h1> */}
      <h1 className={classes["page-h1-create-new-action"]}>Publish new action</h1>
      <FormFields
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
          Send
        </Button>
      </div>

      <FileFeedbackDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        filesFeedbackList={filesFeedbackList}
        setFilesFeedbackList={setFilesFeedbackList}
      />
    </form>
    // </div>
  )
}

export default CreateAction