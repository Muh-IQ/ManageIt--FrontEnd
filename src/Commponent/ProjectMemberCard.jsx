import * as React from 'react';
import {
    Card,
    CardContent,
    Avatar,
    Typography,
    Button,
    Box,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Collapse,
    Snackbar,
    Alert
} from "@mui/material";
import { DeleteToApi, PostToApi } from '../Utility/connection';

export default function ProjectMemberCard({ Data, ProjectID }) {
    const [permission, setPermission] = React.useState(Data.permission);
    const [editMode, setEditMode] = React.useState(false);
    const [alertOpen, setAlertOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [alertSeverity, setAlertSeverity] = React.useState('info');

    const memberID = Data.projectMemberID;
    const projectID = ProjectID;

    const showAlert = (message, severity = 'info') => {
        setAlertMessage(message);
        setAlertSeverity(severity);
        setAlertOpen(true);
    };

    const handleAlertClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setAlertOpen(false);
    };

    const UpdatePermission = async () => {
        const body = {
            projectID: parseInt(projectID),
            projectMemberID: parseInt(memberID),
            permission: permission
        };

        try {
            const response = await PostToApi('ProjectMember/SetProjectMemberPermission', JSON.stringify(body));

            if (response.ok) {
                showAlert('Permission updated successfully', 'success');
            } else {
                showAlert('Failed to update permission', 'error');
            }
        } catch (error) {
            showAlert('Error updating permission', 'error');
        }
    };

    const DeleteMember = async () => {
        const body = {
            projectID: parseInt(projectID),
            projectMemberID: parseInt(memberID),
        };

        try {
            const response = await DeleteToApi('ProjectMember/RemoveProjectMember', JSON.stringify(body));

            if (response.ok) {
                showAlert('Member removed successfully', 'success');
            } else {
                showAlert('Failed to remove member', 'error');
            }
        } catch (error) {
            showAlert('Error removing member', 'error');
        }
    };

    const handlePermissionChange = (event) => {
        setPermission(event.target.value);
    };

    const handleToggleEdit = () => {
        setEditMode(!editMode);
    };

    const handleUpdate = () => {
        console.log("Permission updated to:", permission);
        UpdatePermission();
        setEditMode(false);
    };

    const handleDelete = () => {
        console.log("Member deleted!");
        DeleteMember()
    };

    return (
        <Card sx={{ mb: 2, p: 2 }}>
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
                    <Typography color="text.secondary">
                        {Data.permission == 1 ? 'Member' : Data.permission == 2 ? 'Owner' : 'Task Leader'}
                    </Typography>
                </Box>

                <Button
                    variant="contained"
                    size="small"
                    onClick={handleToggleEdit}
                    sx={{
                        fontSize: '14px',
                        mt: { xs: 1, sm: 0 },
                        width: { xs: '100%', sm: 'auto' },
                        color: 'white',
                    }}
                >
                    {editMode ? 'Undo' : 'Edit'}
                </Button>
            </CardContent>

            <Collapse in={editMode}>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'stretch', sm: 'center' },
                        gap: 2,
                        p: 2,
                        pt: 0
                    }}
                >
                    <FormControl
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 150, flex: 1 }}
                    >
                        <InputLabel id="permission-label">Permission</InputLabel>
                        <Select
                            labelId="permission-label"
                            value={permission}
                            onChange={handlePermissionChange}
                            label="Permission"
                        >
                            <MenuItem value={1}>Member</MenuItem>
                            <MenuItem value={3}>TaskLeader</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleUpdate}
                        sx={{
                            fontSize: '14px',
                            height: '40px',
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        Update
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={handleDelete}
                        sx={{
                            fontSize: '14px',
                            height: '40px',
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        Delete
                    </Button>
                </Box>
            </Collapse>

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
        </Card>
    );
}
