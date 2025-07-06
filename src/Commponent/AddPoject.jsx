import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Header from './Header';
import TextField from '@mui/material/TextField';
import { Button, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { PostToApi } from '../Utility/connection';

export default function AddProject() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [requirements, setRequirements] = useState('');

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' // success, error, warning, info
    });

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };
    const SaveProject = async () => {
        const data = {
            name: name.trim(),
            description: description,
            requirements: requirements
        };
        try {
            const response = await PostToApi(`Project/AddProject`, JSON.stringify(data));
            if (response.ok) {
                setSnackbar({
                    open: true,
                    message: 'Save was successful!',
                    severity: 'success'
                });
                setName('');
                setDescription('');
                setRequirements('');
            } else {
                setSnackbar({
                    open: true,
                    message: 'An error occurred',
                    severity: 'error'
                });
            }

        } catch (error) {
            setSnackbar({
                open: true,
                message: 'An error occurred',
                severity: 'error'
            });
        }
    };
    const handleSave = async () => {
        if (!name.trim() || !description.trim() || !requirements.trim()) {
            setSnackbar({
                open: true,
                message: 'Should bee fill all fields!',
                severity: 'warning'
            });
            return;
        }

        await SaveProject();

    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <Header />
            </Box>
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: '#cfe8fc', marginTop: '80px', p: 2 }}>
                    {/* الاسم */}
                    <TextField
                        id="project-name"
                        label="Name"
                        placeholder="Project name"
                        variant="standard"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ margin: '10px 20px', width: '90%' }}
                    />

                    {/* الوصف */}
                    <TextField
                        id="project-description"
                        label="Description"
                        multiline
                        rows={4}
                        variant="filled"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
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
                    />

                    {/* المتطلبات */}
                    <TextField
                        id="project-requirement"
                        label="Requirement"
                        multiline
                        rows={12}
                        variant="filled"
                        value={requirements}
                        onChange={(e) => setRequirements(e.target.value)}
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
                    />

                    {/* زر الحفظ */}
                    <Box sx={{ textAlign: 'center', mt: 3 }}>
                        <Button variant="contained" color="primary" onClick={handleSave}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Container>

            {/* Snackbar التنبيه */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}
