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
  Alert,
} from '@mui/material';

import { PUTToAPI, DeleteByQueryToApi } from '../Utility/connection';

export default function TaskMemberCard({ Data }) {
  const [editMode, setEditMode] = React.useState(false);
  const [permission, setPermission] = React.useState(Data.permission);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'info' });
  const [isDeleted, setIsDeleted] = React.useState(false);

  const handleToggleEdit = () => {
    setEditMode(!editMode);
  };

  const handleUpdatePermission = async () => {
    try {
      const body = {
        taskMemberID: Data.taskMemberID,
        permission: permission,
      };

      const response = await PUTToAPI('TaskMember/ChangeTaskMemberPermission', JSON.stringify(body));

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Permission updated successfully!',
          severity: 'success',
        });
        setEditMode(false);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to update permission.',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error occurred during update.',
        severity: 'error',
      });
    }
  };

  const handleDeleteTaskMember = async () => {
    try {
      const response = await DeleteByQueryToApi(`TaskMember/DeleteTaskMember?TaskMemberID=${Data.taskMemberID}`);
      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Member deleted successfully!',
          severity: 'success',
        });

       
        setTimeout(() => {
          setIsDeleted(true);
        }, 5000);
      } else {
        setSnackbar({
          open: true,
          message: 'Failed to delete member.',
          severity: 'error',
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error occurred during deletion.',
        severity: 'error',
      });
    }
  };

  if (isDeleted) return <></>; //

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
          <Typography color="text.secondary">{getRole(Data.permission)}</Typography>
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
            pt: 0,
          }}
        >
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150, flex: 1 }}>
            <InputLabel id="permission-label">Permission</InputLabel>
            <Select
              labelId="permission-label"
              value={permission}
              onChange={(e) => setPermission(e.target.value)}
              label="Permission"
            >
              <MenuItem value={1}>Member</MenuItem>
              <MenuItem value={3}>TaskLeader</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="outlined"
            size="small"
            sx={{
              fontSize: '14px',
              height: '40px',
              width: { xs: '100%', sm: 'auto' },
            }}
            onClick={handleUpdatePermission}
          >
            Update
          </Button>

          <Button
            variant="outlined"
            color="error"
            size="small"
            sx={{
              fontSize: '14px',
              height: '40px',
              width: { xs: '100%', sm: 'auto' },
            }}
            onClick={handleDeleteTaskMember}
          >
            Delete
          </Button>
        </Box>
      </Collapse>

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
    </Card>
  );
}

function getRole(role) {
  switch (+role) {
    case 1:
      return 'Member';
    case 2:
      return 'Owner';
    case 3:
      return 'Leader';
    default:
      return 'Unknown';
  }
}
