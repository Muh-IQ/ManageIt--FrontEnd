import * as React from 'react';
import {
    Card,
    CardContent,
    Avatar,
    Typography,
    Button,
    Box,
    Snackbar,
    Alert
} from "@mui/material";
import { PostToApi } from '../Utility/connection';
import { useState } from 'react';

export default function ProjectMemberInTaskCard({ Data, TaskID }) {
    const [isAdd, setIsAdd] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const PostTaskList = async () => {
        const dataToSend = {
            permission: 1,
            projectMemberID: Number(Data.projectMemberID),
            taskID: Number(TaskID)
        };

        const response = await PostToApi(`TaskMember/AddTaskMember`, JSON.stringify(dataToSend));

        if (response.ok) {
            setSnackbar({ open: true, message: 'Member added successfully!', severity: 'success' });

            setTimeout(() => {
                setIsAdd(true);
            }, 5000); // 5s
        } else {
            setSnackbar({ open: true, message: 'Failed to add Member.', severity: 'error' });
        }
    };

    const handleAdd = () => {
        PostTaskList();
    };

    return (
        <>
            {isAdd ? null : (
                <Card sx={{ mb: 2, maxHeight: '120px' }}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'flex-start', sm: 'center' },
                            gap: 2,
                        }}
                    >
                        <Avatar src={Data.imagePath} sx={{ width: 64, height: 64 }} />

                        <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6">{Data.userName}</Typography>
                        </Box>

                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                fontSize: '14px',
                                mt: { xs: 1, sm: 0 },
                                width: { xs: '100%', sm: 'auto' },
                                color: 'white',
                            }}
                            onClick={handleAdd}
                        >
                            Add to task
                        </Button>
                    </CardContent>
                </Card>
            )}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}
