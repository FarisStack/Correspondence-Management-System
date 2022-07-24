
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
// ================= CSS Styling: ===================
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// the above .css file contain the essential styling which comes with the library.
// So, it must be imported. 👆
import "./css/TextEditor.css"; //this is our custom additional styling file

function TextEditor({ richTextState, setRichTextState }) {


    const onEditorStateChange = (editorState) => {
        setRichTextState(editorState);

        console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())));
    }




    return (
        <>
            <div className="text-editor">
                <div className="masterContainer95">
                    <label className="font-weight-bold">Message</label>
                    <Editor
                        editorState={richTextState}
                        toolbarClassName="toolbarClassName"
                        wrapperClassName="wrapperClassName"
                        editorClassName="editorClassName"
                        onEditorStateChange={onEditorStateChange}
                    />
                    <textarea
                        style={{ display: 'none' }}
                        disabled
                        ref={(val) => { richTextState = val }}
                        value={
                            draftToHtml(
                                convertToRaw(richTextState.getCurrentContent())
                            )
                        }
                    />
                </div>
            </div>
        </>
    )

}
export default TextEditor
