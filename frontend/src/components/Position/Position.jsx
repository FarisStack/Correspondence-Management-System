import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';

import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';

import { Tree, TreeNode } from 'react-organizational-chart';

import { Formik, Field } from 'formik';

import axios from 'axios';

import './Position.css';


const Position = () => {

    const [positions, setPositions] = useState([{ description: 'Top of Hierarchy', parent: 'Top of Hierarchy' }]); // hierarchy positions
    const [options, setOptions] = useState([{ label: "Top of Hierarchy" }]); // options in Autocomplete input
    const [tree, setTree] = useState(new Map([['Top of Hierarchy', ["Not Exist Any Position"]]])); // map of positions to drawing

    const [description, setDescription] = useState("");  // to set position description when handleEdit it
    const [parent, setParent] = useState("Top of Hierarchy");  // to set position parent when handleEdit it

    const [textOfButton, setTextOfButton] = useState("Add");  // to hide a
    const [hidden, setHidden] = useState("none");  // to hide and display handleCancel button

    const [navbar, setNavbar] = useState("block"); // to display and hide navbar
    const [button, setButton] = useState(false);   // to disabled button when if positions is exist
    const [title, setTitle] = useState("Build Positions (Hierarchy)"); // title of page

    // when change state positions update tree state to render draw tree updated
    useEffect(() => {
        if (positions.length > 1)
            updateTree();
    }, [positions]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}positions`).then((res) => {
            const _positions = res.data.positions;
            //check if length large than 0 => disabled navbar
            if (_positions.length > 1) {
                setNavbar("none");
                setButton(true);
                let newPosition = [];
                _positions.map(item => {
                    if (item.parentId === null) { // head of tree (top of hierarchy
                        newPosition.push({ description: item.description, parent: 'Top of Hierarchy' });
                    }
                    else {
                        const parentDescription = _positions.filter(it => it.id === item.parentId)[0].description;
                        newPosition.push({ description: item.description, parent: parentDescription });
                    }
                });
                setPositions(newPosition);
                setTitle("Positions (Hierarchy)");
            }
            //set positions on positions state
        }).catch((err) => {
            console.log(err)
            //alert to failed to get positions
        })
    }, []);

    const save = () => {
        // axios to post
        axios.post(`${process.env.REACT_APP_API_URL}positions`, positions).then((res) => {
            setNavbar("none");
            setButton(true);
            setTitle("Positions (Hierarchy)");

            //alert success
        }).catch((err) => {
            //alert to failed to get positions
        });
    }

    const add = (props) => {

        // check if position exist
        let descriptionExist = positions.filter(position => position.description.toLowerCase() === props.description.toLowerCase());
        if (descriptionExist.length > 0) {
            alert("Exist Position");
            return;
        }
        //check if parent is correct or not
        let parentExist = positions.filter(position => position.description.toLowerCase() === props.parent.toLowerCase());
        if (parentExist.length <= 0) {
            alert("Parent not correct");
            return;
        }

        setPositions([{ description: props.description, parent: props.parent }, ...positions]);        //add position
        setOptions([{ label: props.description }, ...options.filter(item => item.label !== 'Top of Hierarchy')]);        //update position
        setParent(props.description);        //update parent state to set the new position as parent to next position initialy
    }


    const edit = (props) => {
        setTextOfButton("Add"); // update button to add
        setHidden("none"); // hide cancel button

        positions.forEach((position) => {
            if (position.description === description) {
                position.description = props.description;
                position.parent = props.parent;
            }
            else if (position.parent === description) {
                position.parent = props.description;
            }
        });

        updateTree(); //  update tree to render draw
        setDescription(""); // set description field is empty

        //update options in Autocomplete (reset Autocomplete)
        const items = defaultOption();
        setOptions(items);

        setParent(items[0].label); // to set last options on select
    }

    const handleCancel = () => {
        setTextOfButton("Add"); // update button text
        setHidden("none"); // hide cancel

        setDescription(""); // clear description

        //update options in Autocomplete (reset Autocomplete)
        const items = defaultOption();
        setOptions(items);
    }

    // all options that can be parent of any new position
    const defaultOption = (parent) => {
        let items = [];
        positions.map(item => {
            if (item.description === parent)
                items.unshift({ label: item.description }); // to add first to get parent of the current position using 0 index
            else if (item.description !== 'Top of Hierarchy')
                items.push({ label: item.description });
        });
        return [...items];
    }

    // update fields to edit
    const handleEdit = (description, parent) => {
        const items = defaultOption(parent);
        const children = childrenOfNode(description);

        //filter options to option that can be parent of current position
        const updateOptions = items.filter(item => !children.includes(item.label));
        if (updateOptions.length === 0) {
            setOptions([{ label: 'Top of Hierarchy' }]); // when edit the root position
            setParent('Top of Hierarchy');
        }
        else {
            setOptions(updateOptions);
            setParent(parent);
        }

        setDescription(description);
        setTextOfButton("Edit"); // update button
        setHidden("block"); // display cancel
    }

    // choose function that be run (add or edit)
    const handleAddOrEdit = (props) => {
        if (textOfButton === "Add") add(props);
        else edit(props);
    }

    //children of any node include current node
    const childrenOfNode = (node) => {
        let s = [];
        let explored = new Set();
        s.push(node);
        explored.add(node);
        while (s.length > 0) {
            let t = s.pop();
            const children = tree.get(t);
            if (children) {
                children.map(item => {
                    if (!explored.has(item)) {
                        explored.add(item);
                        s.push(item);
                    }
                });
            }
        }
        return [...explored];
    }

    const handleDelete = (pos, par) => {
        if (textOfButton === 'Add') {
            const children = childrenOfNode(pos); // get children of position include position
            const updatePosition = positions.filter(item => !children.includes(item.description)); // remove children from positions sate
            setPositions(updatePosition); // update positions

            const updateOption = defaultOption().filter(item => !children.includes(item.label)); // remove children from options state
            setOptions(updateOption); // update options
            setParent(updateOption[0].label); // to set last options on select
        }
        else {
            alert("Edit position before")
            //alert make edit before
        }
    }

    //update tree state to draw new tree when tree state is changed
    const updateTree = () => {
        // unique parents
        let parents = [];
        positions.forEach((element) => {
            if (!parents.includes(element.parent)) {
                parents.push(element.parent);
            }
        });

        let newMap = new Map();
        parents.map(parent => {
            const children = [];
            positions.forEach((element) => {
                if (element.parent === parent && element.parent !== element.description) {
                    children.push(element.description);
                }
            })
            newMap.set(parent, children);
        });
        setTree(newMap);
    }

    // DFS algorithm to draw tree state
    const Node = function (key) {
        const children = tree.get(key);
        let toBeRendered = [];
        if (children !== undefined && children.length > 0) { // check if there exist children
            children.map(node => {
                const arr = tree.get(node) ? (
                    <TreeNode key={node}
                        label={<div className="node">
                            <Tooltip arrow className="tooltip"
                                title={button ? "" :
                                    <div className="divTooltip">
                                        <Button
                                            onClick={() => { handleDelete(node, key) }}
                                            className="deleteButton"
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            onClick={() => { handleEdit(node, key) }}
                                            className="editButton"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                }
                                placement='right'
                            >
                                <span>
                                    {node}
                                </span>
                            </Tooltip>
                        </div>}
                    >
                        {Node(node)}
                    </TreeNode >
                ) : (
                    <TreeNode key={node}
                        label={<div className="node">
                            <Tooltip arrow className="tooltip"
                                title={button ? "" :
                                    <div className="divTooltip">
                                        <Button
                                            onClick={() => { handleDelete(node, key) }}
                                            className="deleteButton"
                                        >
                                            Delete
                                        </Button>

                                        <Button
                                            onClick={() => { handleEdit(node, key) }}
                                            className="editButton"
                                        >
                                            Edit
                                        </Button>
                                    </div>
                                }
                                placement='right'
                            >
                                <span>
                                    {node}
                                </span>
                            </Tooltip>
                        </div>}
                    />
                );
                toBeRendered.push(arr);
            });
        }
        return toBeRendered;
    }

    //Draw tree using Node function
    function drawTree() {
        return (
            <Tree
                lineWidth={'2px'}
                lineColor={'black'}
                lineBorderRadius={'10px'}
                label={<div className="TopNode">
                    <Tooltip arrow className="tooltip"
                        title={(button || ([...tree.get("Top of Hierarchy")][0] === "Not Exist Any Position")) ? "" :
                            <div className="divTooltip">
                                <Button
                                    onClick={() => { handleEdit([...tree.get("Top of Hierarchy")][0], [...tree.get("Top of Hierarchy")][0]) }}
                                    className="editButton"
                                >
                                    Edit
                                </Button>
                            </div>
                        }
                        placement='right'
                    >
                        <span>
                            {[...tree.get("Top of Hierarchy")][0]}
                        </span>
                    </Tooltip>
                </div>}
            >
                {Node([...tree.get("Top of Hierarchy")][0])}
            </Tree >
        )
    }

    return (
        <div className="superDiv">
            <div className="parentDiv">
                <h1 className="title"> {title} </h1>
                <Formik
                    initialValues={{ description: description, parent: parent }}
                    enableReinitialize
                    onSubmit={values => {
                        handleAddOrEdit(values);
                    }}
                >
                    {({
                        values,
                        handleSubmit,
                        setFieldValue,
                        handleChange,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="navbarDiv" style={{ "display": navbar }}>
                                <p >Note: If you want to edit or delete any position make mouse over the position on tree will display buttons</p>
                                <Grid className="grid" container spacing={2} flex>
                                    <Grid item className="gridPositionField">
                                        <Field
                                            name="description"
                                            render={({ field }) => (
                                                <>
                                                    <TextField
                                                        required
                                                        name="description"
                                                        label="Position name"
                                                        variant="outlined"
                                                        className="positionField"
                                                        {...field}
                                                    />
                                                </>
                                            )}
                                        />
                                    </Grid>
                                    <Grid item className="gridParentField">
                                        <Autocomplete
                                            disablePortal
                                            name="parent"
                                            className="parentField"
                                            options={options}
                                            value={values.parent}
                                            onChange={(event, value) => {
                                                setFieldValue("parent", value.label);
                                                values.parent = value.label;
                                            }}
                                            renderInput={(params) => <TextField required onChange={handleChange} {...params} label="Parent name" />}
                                        />
                                    </Grid>
                                    <Grid item >
                                        <Stack spacing={2} direction="row">
                                            <Button className="addOrEditButton" type="submit" variant="contained" >{textOfButton}</Button>
                                            <Button className="cancelButton" style={{ "display": hidden }} onClick={handleCancel} variant="contained" >Cancel</Button>
                                            <Button className="submitButton" color="primary" endIcon={<SendIcon />} onClick={save} variant="contained">Submit</Button>
                                        </Stack>
                                    </Grid>

                                </Grid>
                            </div>
                        </form>
                    )}
                </Formik>
                <div className="treeDiv">
                    {drawTree()}
                </div>
            </div>
        </div>
    )
}
export default Position;
