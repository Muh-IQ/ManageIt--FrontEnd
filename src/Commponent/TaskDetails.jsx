import * as React from 'react';
import {
    CssBaseline,
    Box,
    TextField,
    Button,
    Typography
} from '@mui/material';
import Header from './Header';
import TaskChat from './TaskChat';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import {
    FetchFromAPI, PUTByQueryToAPI
} from '../Utility/connection';
export default function TaskDetails() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const taskID = queryParams.get('taskId');

    const [taskData, setTaskData] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);



    const fetchTaskData = async () => {
        const response = await FetchFromAPI(`Task/GetTask?TaskID=${taskID}`);
        const data = await response.json();
        setTaskData(data);
        if (data.permission > 1) {
            setIsAdmin(true);
        }
    };
    const PutStartDateTask = async () => {
        const response = await PUTByQueryToAPI(`Task/SetStartDateTask?TaskID=${taskID}`);
        if (response.ok) {
            fetchTaskData();
        }
    };
    const PutDeliveryDateTask = async () => {
        const response = await PUTByQueryToAPI(`Task/SetDeliveryDateTask?TaskID=${taskID}`);
        if (response.ok) {
            fetchTaskData();
        }
    };
    useEffect(() => {
        fetchTaskData();
    }, []);


    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <Header />
            </Box>
            <Box
                sx={{
                    width: '95vw',
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    gap: 3,
                    margin: '80px auto 0',
                }}
            >
                {/* TaskDetails */}
                <Box
                    sx={{
                        bgcolor: '#cfe8fc',
                        width: { xs: '100%', md: '65%' },
                        height: { xs: 'auto', md: '85vh' },
                        color: '#3b7b8f',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '25px',
                        borderRadius: 3,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    }}
                >
                    <Box>
                        <Typography variant="h4" component="h4">
                            {taskData.tasksName}
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                mt: 1,
                                px: 1.5,
                                py: 0.5,
                                display: 'inline-block',
                                bgcolor: '#dcedc894',
                                borderRadius: 2,
                                fontWeight: 600,
                            }}
                        >
                            {taskData.statusName}
                        </Typography>
                    </Box>

                    <Box>
                        <Typography variant="h5" sx={{ mb: 1 }}>
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-line', pl: 1 }}>
                            {taskData.description}
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">Start Date:</Typography>
                        <Typography variant="body1" sx={{ pl: 1 }}>{taskData.startDate ? formatDateToCustomString(taskData.startDate) : 'N/A'}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="h6">Delivery Date:</Typography>
                        <Typography variant="body1" sx={{ pl: 1 }}>{taskData.deliveryDate ? formatDateToCustomString(taskData.deliveryDate) : 'N/A'}</Typography>
                    </Box>

                    {isAdmin && <Box sx={{ mt: 'auto', display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="outlined"
                            size="medium"
                            sx={{
                                borderColor: '#1976d2',
                                color: '#1976d2',
                                ':hover': {
                                    bgcolor: '#1976d222',
                                    borderColor: '#1976d2',
                                },
                            }}
                            onClick={PutStartDateTask}
                        >
                            Start Task
                        </Button>
                        <Button
                            variant="outlined"
                            size="medium"
                            sx={{
                                borderColor: '#d32f2f',
                                color: '#d32f2f',
                                ':hover': {
                                    bgcolor: '#d32f2f22',
                                    borderColor: '#d32f2f',
                                },
                            }}
                            onClick={PutDeliveryDateTask}
                        >
                            End Task
                        </Button>
                    </Box>}
                </Box>

                {/* Chat and Member */}
                <Box
                    sx={{
                        width: { xs: '100%', md: '30%' },
                        mt: { xs: 3, md: 0 },
                        height: { xs: '70vh', md: 'auto' },
                    }}
                >
                    <TaskChat taskID={taskID} />
                </Box>

            </Box>
        </React.Fragment>
    );
}

function formatDateToCustomString(inputDate) {
    const date = new Date(inputDate);
    const year = date.getFullYear();
    const day = String(date.getDate()).padStart(2, '0');

    const shortMonths = ["jan", "feb", "mar", "apr", "may", "jun",
        "jul", "aug", "sep", "oct", "nov", "dec"];
    const month = shortMonths[date.getMonth()];

    return `${year}-${month}-${day}`;
}