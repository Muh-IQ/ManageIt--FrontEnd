import Box from '@mui/material/Box';
import Header from './Header';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { FetchFromAPI, PostToApi, PUTToAPI, DeleteByQueryToApi } from '../Utility/connection';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

export default function TaskList() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectID = queryParams.get('proid');
    const [tasks, setTasks] = useState([]);
    const [selectedTaskListName, setSelectedTaskListName] = useState();
    const [newTaskListNameOfAdd, setNewTaskListNameOfAdd] = useState('');
    const [newTaskListNameOfUpdate, setNewTaskListNameOfUpdate] = useState('');
    const [nameError, setNameError] = useState(false);

    // Snackbar
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Delete Dialog
    const [confirmOpen, setConfirmOpen] = useState(false);

    const fetchTasks = async () => {
        const response = await FetchFromAPI(`TaskList/GetTaskListsWithTasks?ProjectID=${projectID}`);
        const data = await response.json();
        setTasks(data);
    };

    const PostTaskList = async () => {
        if (!newTaskListNameOfAdd.trim()) {
            setNameError(true);
            return;
        }
        setNameError(false);

        const dataToSend = {
            name: newTaskListNameOfAdd,
            projectID: Number(projectID)
        };

        const response = await PostToApi(`TaskList/AddTaskList`, JSON.stringify(dataToSend));
        if (response.ok) {
            setNewTaskListNameOfAdd('');
            fetchTasks();
            setSnackbar({ open: true, message: 'Task list added successfully!', severity: 'success' });
        } else {
            setSnackbar({ open: true, message: 'Failed to add task list.', severity: 'error' });
        }
    };

    const PutTaskList = async () => {
        if (!newTaskListNameOfUpdate.trim()) {
            setNameError(true);
            return;
        }

        setNameError(false);

        const dataToSend = {
            name: newTaskListNameOfUpdate,
            projectID: Number(projectID),
            taskListID: Number(selectedTaskListName.Id)
        };

        const response = await PUTToAPI(`TaskList/UpdateTaskList`, JSON.stringify(dataToSend));
        if (response.ok) {
            setSelectedTaskListName({ Name: newTaskListNameOfUpdate, Id: selectedTaskListName.Id });
            setNewTaskListNameOfUpdate('');
            fetchTasks();
            setSnackbar({ open: true, message: 'Task list updated successfully!', severity: 'success' });
        } else {
            setSnackbar({ open: true, message: 'Failed to update task list.', severity: 'error' });
        }
    };

    const handleDeleteClick = () => {
        setConfirmOpen(true);
    };

    const handleConfirmDelete = async () => {
        setConfirmOpen(false);
        const response = await DeleteByQueryToApi(`TaskList/DeleteTasksList?TaskListID=${selectedTaskListName.Id}`);
        if (response.ok) {
            setSelectedTaskListName({});
            setNewTaskListNameOfUpdate('');
            fetchTasks();
            setSnackbar({ open: true, message: 'Task list deleted successfully!', severity: 'success' });
        } else {
            setSnackbar({ open: true, message: 'Failed to delete task list.', severity: 'error' });
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <>
            <Box sx={{ position: 'absolute', top: '0', left: '0', width: '100%' }}>
                <Header />
            </Box>

            <Box sx={{ bgcolor: '#cfe8fc', display: 'flex', gap: '150px', flexWrap: 'wrap', justifyContent: 'space-between', marginTop: '80px', p: '20px', minWidth: '70vw', minHeight: '70vh' }}>
                <Box sx={{ minWidth: '30%', color: 'black' }}>
                    <SimpleTreeView>
                        {tasks.map((taskList) => (
                            <TreeItem
                                key={taskList.taskListID}
                                itemId={`list-${taskList.taskListID}`}
                                label={taskList.taskListName}
                                onClick={() => setSelectedTaskListName({ Name: taskList.taskListName, Id: taskList.taskListID })}
                            >
                                {taskList.tasks.map((task) => {
                                    const taskLabel = (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Link
                                                to={`/ProjectDetails/TaskList/UpdateTask?proid=${projectID}&taskid=${task.taskID}`}
                                                style={{ textDecoration: 'none', color: 'inherit' }}
                                            >
                                                {task.taskName}
                                            </Link>
                                        </Box>
                                    );
                                    return (
                                        <TreeItem
                                            key={task.taskID}
                                            itemId={`task-${task.taskID}`}
                                            label={taskLabel}
                                        />
                                    );
                                })}
                            </TreeItem>
                        ))}
                    </SimpleTreeView>
                </Box>

                <Box sx={{ minWidth: '30%' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', bgcolor: '#61dafb59', p: '20px', marginBottom: '20px' }}>
                        <Typography variant="h5" gutterBottom>
                            New Task List
                        </Typography>
                        <TextField
                            label="Task Name"
                            variant="standard"
                            value={newTaskListNameOfAdd}
                            onChange={(e) => setNewTaskListNameOfAdd(e.target.value)}
                            error={nameError}
                            helperText={nameError ? "Task list name is required" : ""}
                        />
                        <Button variant="contained" color="success" onClick={PostTaskList}>
                            Add
                        </Button>
                    </Box>

                    {selectedTaskListName && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', bgcolor: '#61dafb59', p: '20px' }}>
                            <Box>
                                <label style={{
                                    paddingBottom: '2px',
                                    color: 'rgb(211, 47, 47)',
                                    borderBottom: 'solid'
                                }}>Update</label>

                                <Typography variant="h5" gutterBottom>
                                    {selectedTaskListName.Name}
                                </Typography>
                            </Box>

                            <TextField
                                label="New Task Name"
                                variant="standard"
                                value={newTaskListNameOfUpdate}
                                onChange={(e) => setNewTaskListNameOfUpdate(e.target.value)}
                                error={nameError}
                                helperText={nameError ? "Task list name is required" : ""}
                            />

                            <Box sx={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
                                <Button variant="contained" color="success" onClick={PutTaskList}>
                                    Update
                                </Button>
                                <Button variant="contained" color="error" onClick={handleDeleteClick}>
                                    Delete
                                </Button>

                                <Link to={`/ProjectDetails/TaskList/AddTask?tl-id=${selectedTaskListName.Id}`}>
                                    <Button variant="contained">New Task</Button>
                                </Link>

                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Dialog of sure delete*/}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete the selected task list?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar notify*/}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <MuiAlert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </>
    );
}
