import * as React from 'react';
import {
    CssBaseline,
    Box,
    CardContent,
    TextField,
    Button,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    Snackbar,
    Alert
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import ProjectMemberCard from './ProjectMemberCard';
import { useEffect, useState } from 'react';
import { FetchFromAPI, PUTToAPI, PostToApi } from '../Utility/connection';
import SimpleCache from '../Utility/SimpleCache';

export default function UpdateProject() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const cache = new SimpleCache();

    const [projectInfo, setProjectInfo] = useState({});
    const [statuses, setStatuses] = useState([]);
    // this for add member
    const [permission, setPermission] = useState(1);

    const [isEmailValid, setIsEmailValid] = useState(false);
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertSeverity, setAlertSeverity] = useState('info');
    const [alertMessage, setAlertMessage] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 15;
    const [totalCount, setTotalCount] = useState(0);
    const [members, setMembers] = useState([]);

    const fetchProjectMembersCount = async () => {
        const response = await FetchFromAPI(`ProjectMember/GetCountProjectMembers?ProjectID=${id}`);
        const data = await response.json();
        setTotalCount(data);
    };

    const fetchProjectInfo = async () => {
        const response = await FetchFromAPI(`Project/GetProjectDetails?projectID=${id}`);
        const data = await response.json();
        setProjectInfo(data);
    };
    const fetchStatuses = async () => {
        const response = await FetchFromAPI('Project/GetProjectStatuses');
        const data = await response.json();
        setStatuses(data);
    };
    const fetchProjectMember = async (pageNumber) => {
        const response = await FetchFromAPI(`ProjectMember/GetProjectMembersPaged?ProjectID=${id}&PageNumber=${pageNumber}&PageSize=15`);
        const data = await response.json();
        cache.setListData(pageNumber, data);
        setMembers(prev => [...prev, ...data]);
    };

    useEffect(() => {
        fetchProjectInfo();
        fetchStatuses();
        fetchProjectMembersCount();
        getProjectMember(pageNumber);
    }, []);






    const handleEmailBlur = async (e) => {
        const email = e.target.value
        setIsEmailValid(false);
        if (!e.target.value) return;

        const response = await PostToApi(`User/IsEmailVerifiedExists`, JSON.stringify({ email: email }));
        const data = await response.json();

        if (data) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
            showAlert('Email does not exist', 'error');
        }
    };
    const handleAddMember = async () => {
        const userEmail = document.getElementById('user-email');


        const body = {
            projectID: parseInt(id),
            email: userEmail.value.trim(),
            permission: permission
        };

        try {
            const response = await PostToApi('ProjectMember/AddProjectMember', JSON.stringify(body));

            if (response.ok) {
                showAlert('Member added successfully', 'success');
                // Reset email input if you want:
                userEmail.value = '';
                setIsEmailValid(false);
            } else {
                showAlert('Failed to add member', 'error');
            }
        } catch (error) {
            showAlert('Error adding member', 'error');
        }
    };


    const getProjectMember = (pageNumber) => {
        if (cache.IsExistProjectMemberPage(pageNumber)) {
            const data = cache.getProjectMember(pageNumber);
            if (pageNumber === 1)
                setMembers(data);  // replace
            else
                setMembers(prev => [...prev, ...data]);
            console.log('من الكاش');
        }
        else {
            console.log('من باك');
            fetchProjectMember(pageNumber);
        }
    }


    const showAlert = (message, severity = 'info') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleSave = async () => {
        const nameValue = document.getElementById('project-name').value.trim();
        const descriptionValue = document.getElementById('project-description').value.trim();
        const requirementsValue = document.getElementById('project-requirement').value.trim();
        const statusValue = projectInfo.projectStatusID;

        if (!nameValue) {
            showAlert('Please enter the project name', 'warning');
            return;
        }
        if (!descriptionValue) {
            showAlert('Please enter the description', 'warning');
            return;
        }
        if (!requirementsValue) {
            showAlert('Please enter the requirements', 'warning');
            return;
        }
        if (!statusValue) {
            showAlert('Please select the status', 'warning');
            return;
        }

        const body = {
            projectsID: parseInt(id),
            name: nameValue,
            description: descriptionValue,
            requirements: requirementsValue,
            projectStatuseID: statusValue
        };

        try {
            const response = await PUTToAPI('Project/UpdateProject', JSON.stringify(body));

            if (response.ok) {
                showAlert('Project updated successfully', 'success');
            }
            else {
                showAlert(`Update failed`, 'error');
            }
        } catch (error) {
            showAlert(`Update failed`, 'error');
        }
    };

    const handlePermissionChange = (event) => {
        setPermission(event.target.value);
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setAlertOpen(false);
    };

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 10) {

            const totalPages = Math.ceil(totalCount / pageSize);
            if (pageNumber < totalPages) {
                const nextPage = pageNumber + 1;
                setPageNumber(nextPage);
                getProjectMember(nextPage);

            } else {
                console.log('All members loaded');
            }
        }
    };
    return (
        <React.Fragment>
            <CssBaseline />
            <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
                <Header />
            </Box>

            <Box sx={{ bgcolor: '#cfe8fc', marginTop: '80px', p: 2, display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Members */}
                <Box
                    sx={{
                        p: '10px',
                        border: 'solid 1px white',
                        height: '90vh',
                        overflowY: 'auto'
                    }}
                    onScroll={handleScroll}
                >
                    <CardContent
                        sx={{
                            bgcolor: 'white',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            gap: 2,
                            height: 'auto',
                            paddingBottom: '16px !important',
                            marginBottom: '16px'
                        }}
                    >
                        <TextField
                            id="user-email"
                            label="Email"
                            variant="standard"
                            type="email"
                            size="small"
                            onBlur={handleEmailBlur}
                            sx={{ minWidth: { xs: '100%', sm: '200px' }, fontSize: { xs: '14px' } }}
                        />

                        <FormControl
                            variant="standard"
                            size="small"
                            sx={{ minWidth: { xs: '100%', sm: 120 } }}
                        >
                            <InputLabel id="demo-simple-select-standard-label">Permission</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={permission}
                                onChange={handlePermissionChange}
                                label="Permission"
                                fullWidth
                                sx={{ fontSize: { xs: '14px' } }}
                            >
                                <MenuItem value={1}>Member</MenuItem>
                                <MenuItem value={3}>TaskLeader</MenuItem>
                            </Select>
                        </FormControl>

                        <Button
                            variant="outlined"
                            size="small"
                            sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '13px' } }}
                            disabled={!isEmailValid}
                            onClick={handleAddMember}
                        >
                            Add
                        </Button>
                    </CardContent>
                    {/* Member Cards */}
                    {members.map((member, index) => (
                        <ProjectMemberCard key={index} Data={member} ProjectID={id} />
                    ))}


                </Box>

                {/* Project Info */}
                <Box >
                    <TextField
                        id="project-name"
                        label="Name"
                        placeholder="Project name"
                        variant="standard"
                        defaultValue={projectInfo.projectName}
                        sx={{ margin: '10px 20px', width: '90%' }}
                    />

                    <TextField
                        id="project-description"
                        label="Description"
                        multiline
                        rows={4}
                        variant="filled"
                        defaultValue={projectInfo.description}
                        sx={{
                            width: '90%',
                            margin: '10px 20px',
                            '& .MuiFilledInput-root': { overflow: 'auto' },
                            '& textarea': { overflow: 'auto', resize: 'none' }
                        }}
                    />

                    <TextField
                        id="project-requirement"
                        label="Requirement"
                        multiline
                        rows={12}
                        variant="filled"
                        defaultValue={projectInfo.requirements}
                        sx={{
                            width: '90%',
                            margin: '10px 20px',
                            '& .MuiFilledInput-root': { overflow: 'auto' },
                            '& textarea': { overflow: 'auto', resize: 'none' }
                        }}
                    />

                    <Box>
                        {statuses.length > 0 && (
                            <FormControl
                                variant="standard"
                                size="small"
                                sx={{ display: 'block', margin: '10px 20px', width: '90%' }}
                            >
                                <InputLabel id="status-select-label">Status</InputLabel>
                                <Select
                                    labelId="status-select-label"
                                    id="status-select"
                                    value={projectInfo.projectStatusID || ''}
                                    onChange={(e) => setProjectInfo({ ...projectInfo, projectStatusID: e.target.value })}
                                    fullWidth
                                >
                                    {statuses.map(status => (
                                        <MenuItem key={status.id} value={status.id}>
                                            {status.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <Box sx={{ textAlign: 'center', mt: 3 }}>
                            <Button
                                sx={{ color: 'white' }}
                                variant="contained"
                                color="primary"
                                onClick={handleSave}
                            >
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Snackbar Alert */}
            <Snackbar
                open={alertOpen}
                autoHideDuration={4000}
                onClose={handleAlertClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleAlertClose} severity={alertSeverity} sx={{ width: '100%' }}>
                    {alertMessage}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}

/*
 * user => 
 *  Id , name  , image 
 * project member => 
 *  projectMemberID , userID  ,permission
 * 
 * chat memb =>
 *  projectID , userID , pageNumber 
 * 
 * user => dic = (int , data)
 * 
 * //// projectMember => dic =(int => pageNumber, list(projectmember))
 * 
 * 
 * //projectMember => dic = (int -> userID  , dic =(projectID,))
 * 
 * pn = 1 
 * {
 *     ob = {p =1 , n = ali , per = 2 ,im = ''}, 
 *     ob = {p =1 , n = omer , per = 2 ,im = ''},   
 *     ob = {p =1 , n = t , per = 2 ,im = ''},   
 *     ob = {p =1 , n = omgger , per = 2 ,im = ''},   
 * }
 */ 