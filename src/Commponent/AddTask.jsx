import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Header from './Header';
import TextField from '@mui/material/TextField';
import { Button, Snackbar, Alert } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { PostToApi } from '../Utility/connection';
import { useEffect, useState } from 'react';

export default function AddTask() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskListID = queryParams.get('tl-id');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const handleSave = async () => {
        if (!name.trim() || !description.trim()) {
            setSnackbar({
                open: true,
                message: 'Please fill all fields.',
                severity: 'warning'
            });
            return;
        }

        const jsonData = {
            name,
            description,
            taskListID: Number(taskListID)
        };

        const response = await PostToApi("Task/AddTask", JSON.stringify(jsonData));

        if (response.ok) {
            setSnackbar({
                open: true,
                message: 'Task added successfully!',
                severity: 'success'
            });
            setName('');
            setDescription('');
        } else {
            setSnackbar({
                open: true,
                message: 'Failed to add task.',
                severity: 'error'
            });
        }
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <Header />
            </Box>
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: '#cfe8fc', marginTop: '80px', p: 2 }}>
                    <TextField
                        id="project-name"
                        label="Name"
                        placeholder="Task name"
                        variant="standard"
                        sx={{ margin: '10px 20px', width: '90%' }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        id="project-description"
                        label="Description"
                        multiline
                        rows={12}
                        variant="filled"
                        sx={{
                            width: '90%',
                            margin: '10px 20px',
                            '& .MuiFilledInput-root': {
                                overflow: 'auto',
                            },
                            '& textarea': {
                                overflow: 'auto',
                                resize: 'none',
                            }
                        }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}
