import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
// ---------- MUI Icons -------------------
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListIcon from '@mui/icons-material/List';
// ---------------------------
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';


export default function SplitButton({
    handleScrollToNewAction,
    handlePrint, 
    moveToArchive
}: any) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleClick = () => {
        console.info(`You clicked ${options[selectedIndex]}`);
    };

    const handleMenuItemClick = (
        event: React.MouseEvent<HTMLLIElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
        setOpen(false);
    };


    const options = [
        {
            label: 'Print this page',
            onClick: () => handlePrint()
        },
        {
            label: 'Move to archive',
            onClick: () => alert("Moved to archive")
        },
    ];

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: Event) => {
        if (
            anchorRef.current &&
            anchorRef.current.contains(event.target as HTMLElement)
        ) {
            return;
        }

        setOpen(false);
    };



    return (
        <React.Fragment>
            <ButtonGroup variant="contained" ref={anchorRef} aria-label="split button">
                {/* <Button onClick={handleClick}>{options[selectedIndex]}</Button> */}
                <Button
                    size="small"
                    aria-controls={open ? 'split-button-menu' : undefined}
                    aria-expanded={open ? 'true' : undefined}
                    aria-label="select merge strategy"
                    aria-haspopup="menu"
                    onClick={handleToggle}
                >
                    <ListIcon style={{ fontSize: "2rem" }} />
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                placement="bottom-end"
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    <MenuItem
                                        onClick={(event) => {
                                            // first, close the split button men list
                                            setOpen(false);
                                            handleScrollToNewAction(); //then call this function
                                        }}
                                    >
                                        Action / Forward / Reply
                                    </MenuItem>
                                    <MenuItem
                                        onClick={(event) => {
                                            // first, close the split button men list
                                            setOpen(false);
                                            handlePrint(); //then call this function
                                        }}
                                    >
                                        Print this page
                                    </MenuItem>
                                    <MenuItem
                                        onClick={(event) => {
                                            // first, close the split button men list
                                            setOpen(false);
                                            moveToArchive(); //then call this function
                                        }}
                                    >
                                        Move to archive
                                    </MenuItem>
                                    {/* {options.map((option, index) => (
                                        <MenuItem
                                            key={option.label}
                                            // disabled={index === 2}
                                            // selected={index === selectedIndex}
                                            // onClick={(event) => {
                                            //     handleMenuItemClick(event, index);
                                            //     option.onClick(); //call the function corresponding to this label.
                                            // }}
                                        >
                                            {option}
                                        </MenuItem>
                                    ))} */}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </React.Fragment>
    );
}
