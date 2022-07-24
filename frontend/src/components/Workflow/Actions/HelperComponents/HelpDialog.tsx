// -------------- MUI Components ------------------------------
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
// -------------- MUI Icons ------------------------------
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';


export default function HelpDialog(props: any) {
    const { onClose, open } = props;

    const colorsMap = [
        {
            color: "#f0f4c3",
            meaning: "You are the sender of the workflow's action",
            icon: <MoveToInboxIcon />
        },
        {
            color: "#c2eafc",
            meaning: "You are a consignee in the workflow's action",
            icon: <OutboxIcon />
        },
        {
            color: "#fff",
            meaning: "You are neither sender nor recipient in the action",
            icon: <SentimentNeutralIcon />
        },
    ]

    const handleClose = () => {
        onClose();
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Actions' Colors Meaning</DialogTitle>
            <Paper
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    listStyle: 'none',
                    p: "10px",
                    m: 0,
                    gap: "10px"
                }}
                component="ul"
            >
                {colorsMap.map((colorObj) => {
                    return (
                        <li key={colorObj.color}>
                            <Chip
                                variant="filled"
                                icon={colorObj.icon}
                                label={colorObj.meaning}
                                onDelete={undefined}
                                sx={{
                                    backgroundColor: colorObj.color,
                                    border: "2px solid #444"
                                    // width: "100%",
                                }}
                            />
                        </li>
                    );
                })}
            </Paper>
        </Dialog>
    );
}

