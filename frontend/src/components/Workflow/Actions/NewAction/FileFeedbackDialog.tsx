import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';

export default function AlertDialog({ isOpen, setIsOpen, filesFeedbackList, setFilesFeedbackList }: any) {
    // const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const RenderMessages = ({ filesFeedbackList }: any) => {
        return (
            <>
                {filesFeedbackList.map((msg: string, index: number) => (
                    <ListItem
                        button
                        // onClick={() => handleListItemClick(email)}
                        key={index}
                    >
                        <ListItemText primary={msg} />
                    </ListItem>
                ))}
            </>
        )
    }

    return (
        <div>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open alert dialog
            </Button> */}
            <Dialog
                open={isOpen}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Attachment upload feedback"}
                </DialogTitle>
                <DialogContent>
                    {/* <DialogContentText id="alert-dialog-description"> */}
                    <List>
                        {filesFeedbackList.length > 0
                            ? <RenderMessages filesFeedbackList={filesFeedbackList} />
                            : (<p>Everything is alright</p>)
                        }
                    </List>
                    {/* </DialogContentText> */}
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={handleClose}>Disagree</Button> */}
                    <Button onClick={handleClose} autoFocus>
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        </div >
    );
}
