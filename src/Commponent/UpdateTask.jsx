import * as React from 'react';
import {
  CssBaseline, Box, TextField, Button, InputLabel, FormControl, Select,
  MenuItem, Snackbar, Alert, Typography, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import Header from './Header';
import TaskMemberCard from './TaskMemberCard';
import ProjectMemberInTaskCard from './ProjectMemberInTaskCard';

import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  FetchFromAPI, PUTToAPI, DeleteByQueryToApi, PUTByQueryToAPI
} from '../Utility/connection';
import SimpleCache from '../Utility/SimpleCache';
import { useNavigate } from 'react-router-dom';

export default function UpdateTask() {
  const cache = new SimpleCache();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectID = queryParams.get('proid');
  const taskID = queryParams.get('taskid');
  const pageSize = 15;
  const navigate = useNavigate();

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogAction, setDialogAction] = useState(null);

  const [projectMembers, setProjectMembers] = useState([]);
  const [pageNumberOfProMem, setPageNumberOfProMem] = useState(1);
  const [totalCountOfProMem, setTotalCountOfProMem] = useState(0);

  const [taskMembers, setTaskMembers] = useState([]);
  const [pageNumberOfTasMem, setPageNumberOfTasMem] = useState(1);
  const [totalCountOfTasMem, setTotalCountOfTasMem] = useState(0);

  const [taskData, setTaskData] = useState({});
  const [statuses, setStatuses] = useState([]);
  const fetchProjectMembers = async (pageNumber) => {
    const response = await FetchFromAPI(`ProjectMember/GetProjectMembersOutsideTaskMember?ProjectID=${projectID}&TaskID=${taskID}&PageNumber=${pageNumber}&PageSize=${pageSize}`);
    const data = await response.json();
    cache.setListDataUpdateTask(pageNumber, data);
    setProjectMembers(prev => [...prev, ...data]);
  };


  const fetchProjectMembersCount = async () => {
    const response = await FetchFromAPI(`ProjectMember/GetCountProjectMembersOutsideTaskMember?ProjectID=${projectID}&TaskID=${taskID}`);
    const data = await response.json();
    setTotalCountOfProMem(data);
  };

  const fetchTaskMembers = async (pageNumber) => {
    const response = await FetchFromAPI(`TaskMember/GetTaskMembersPaged?TaskID=${taskID}&PageNumber=${pageNumber}&PageSize=${pageSize}`);
    const data = await response.json();
    setTaskMembers(prev => [...prev, ...data]);
  };
  const fetchCountTaskMembers = async () => {
    const response = await FetchFromAPI(`TaskMember/GetCountTaskMembers?TaskID=${taskID}`);
    const data = await response.json();
    setTotalCountOfTasMem(data);
  };
  const fetchTaskData = async () => {
    const response = await FetchFromAPI(`Task/GetTask?TaskID=${taskID}`);
    const data = await response.json();
    setTaskData(data);
  };

  const fetchStatuses = async () => {
    const response = await FetchFromAPI('Task/GetTaskStatuses');
    const data = await response.json();
    setStatuses(data);
  };

  useEffect(() => {
    fetchTaskData();
    fetchStatuses();
    fetchProjectMembersCount();
    getProjectMembers(pageNumberOfProMem);
  }, []);

  useEffect(() => {
    fetchTaskMembers(pageNumberOfTasMem);
    fetchCountTaskMembers();
  }, [pageNumberOfTasMem]);
  
  const getProjectMembers = (pageNumber) => {
    if (cache.IsExistProjectMemberPageUpdateTask(pageNumber)) {
      const data = cache.getProjectMemberUpdateTask(pageNumber);
      if (pageNumber === 1)
        setProjectMembers(data);
      else
        setProjectMembers(prev => [...prev, ...data]);
    } else {
      fetchProjectMembers(pageNumber);
      
    }
  };

  const showAlert = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleResetDeliveryDate = async () => {
    const response = await PUTByQueryToAPI(`Task/ResetDeliveryDateTask?TaskID=${taskID}`);
    if (response.ok) {
      showAlert('Reset Delivery Date successfully!', 'success');
    } else {
      showAlert('Failed to Reset Delivery Date.', 'error');
    }
  };

  const handleResetStartDate = async () => {
    const response = await PUTByQueryToAPI(`Task/ResetStartDateTask?TaskID=${taskID}`);
    if (response.ok) {
      showAlert('Reset Start Date successfully!', 'success');
    } else {
      showAlert('Failed to Reset Start Date.', 'error');
    }
  };

  const handleDelete = async () => {
    const response = await DeleteByQueryToApi(`Task/DeleteTask?TaskID=${taskID}`);
    if (response.ok) {
      showAlert('Task deleted successfully!', 'success');
      setTimeout(() => {
        navigate(`/ProjectDetails/TaskList?proid=${projectID}`);
      }, 2000);
    } else {
      showAlert('Failed to delete task.', 'error');
    }
  };

  const handleSave = async () => {
    const nameValue = document.getElementById('task-name').value.trim();
    const descriptionValue = document.getElementById('task-description').value.trim();
    const statusValue = taskData.taskStatusID;

    if (!nameValue) return showAlert('Please enter the task name', 'warning');
    if (!descriptionValue) return showAlert('Please enter the description', 'warning');
    if (!statusValue) return showAlert('Please select the status', 'warning');

    const body = {
      taskID: parseInt(taskID),
      name: nameValue,
      description: descriptionValue,
      taskStatusID: statusValue
    };

    const response = await PUTToAPI('Task/UpdateTask', JSON.stringify(body));
    if (response.ok) {
      showAlert('Task updated successfully', 'success');
    } else {
      showAlert('Update failed', 'error');
    }
  };

  const handleScrollOfProjectMember = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const totalPages = Math.ceil(totalCountOfProMem / pageSize);
      if (pageNumberOfProMem < totalPages) {
        const nextPage = pageNumberOfProMem + 1;
        setPageNumberOfProMem(nextPage);
        getProjectMembers(nextPage);
      }
    }
  };
  const handleScrollOfTaskMember = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const totalPages = Math.ceil(totalCountOfTasMem / pageSize);
      if (pageNumberOfTasMem < totalPages) {
        const nextPage = pageNumberOfTasMem + 1;
        setPageNumberOfTasMem(nextPage);
      }
    }
  };

  const openDialog = (actionType) => {
    setDialogAction(actionType);
    setDialogOpen(true);
  };

  const handleDialogConfirm = async () => {
    setDialogOpen(false);
    if (dialogAction === 'delete') await handleDelete();
    else if (dialogAction === 'resetStart') await handleResetStartDate();
    else if (dialogAction === 'resetDelivery') await handleResetDeliveryDate();
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }}>
        <Header />
      </Box>

      <Box sx={{
        width: '98vw', display: 'flex', flexWrap: 'wrap',
        m: '60px auto 0', gap: '15px',
      }}>
        {/* Update Section */}
        <Box sx={{
          bgcolor: '#cfe8fc', p: 2, flexGrow: 1,
          flexBasis: { xs: '100%', sm: '48%', md: '40%' }
        }}>
          <Typography variant="h6" gutterBottom sx={{
            textTransform: 'uppercase',
            color: 'rgb(49 88 100)', display: 'block'
          }}>
            Update
          </Typography>

          <TextField id="task-name" label="Name"
            placeholder="Project name" variant="standard"
            defaultValue={taskData.tasksName}
            sx={{ margin: '10px 20px', width: '90%' }}
          />

          <TextField id="task-description" label="Description"
            defaultValue={taskData.description} multiline rows={9}
            variant="filled"
            sx={{
              width: '90%', margin: '10px 20px',
              '& .MuiFilledInput-root': { overflow: 'auto' },
              '& textarea': { overflow: 'auto', resize: 'none' }
            }}
          />

          {statuses.length > 0 && (
            <FormControl variant="standard" size="small"
              sx={{ display: 'block', margin: '10px 20px', width: '90%' }}>
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={taskData.taskStatusID || ''}
                onChange={(e) => setTaskData({ ...taskData, taskStatusID: e.target.value })}
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
            <Button variant="contained" color="primary" onClick={handleSave}>
              Save
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="outlined" color="error" startIcon={<RestartAltIcon />}
              onClick={() => openDialog('resetStart')}
              sx={{ margin: '5px' }}>
              Reset Start Date
            </Button>

            <Button variant="outlined" color="error" startIcon={<RestartAltIcon />}
              onClick={() => openDialog('resetDelivery')}
              sx={{ margin: '5px' }}>
              Reset Delivery Date
            </Button>

            <Button variant="outlined" color="error" startIcon={<DeleteIcon />}
              onClick={() => openDialog('delete')}
              sx={{ margin: '5px' }}>
              Delete Task
            </Button>
          </Box>
        </Box>

        {/* Task Member Section */}
        <Box sx={{
          bgcolor: '#cfe8fc', p: 2, flexGrow: 1,
          flexBasis: { xs: '100%', sm: '48%', md: '30%' }
        }}>
          <Typography variant="h6" gutterBottom sx={{
            textTransform: 'uppercase',
            color: 'rgb(49 88 100)', display: 'block'
          }}>
            Task Member
          </Typography>
          <Box
            sx={{
              height: '80vh', overflowY: 'auto',
              border: 'white solid 2px', p: '10px'
            }}
            onScroll={handleScrollOfTaskMember}
          >
            {taskMembers.map((member, index) => (
              <TaskMemberCard key={index} Data={member} />
            ))}
            {/* <TaskMemberCard /> */}
          </Box>
        </Box>

        {/* Project Member Section */}
        <Box sx={{
          bgcolor: '#cfe8fc', p: 2, flexGrow: 1,
          flexBasis: { xs: '100%', sm: '48%', md: '25%' }
        }}>
          <Typography variant="h6" gutterBottom sx={{
            textTransform: 'uppercase',
            color: 'rgb(49 88 100)', display: 'block'
          }}>
            Project Member
          </Typography>
          <Box
            sx={{
              height: '80vh', overflowY: 'auto',
              border: 'white solid 2px', p: '10px'
            }}
            onScroll={handleScrollOfProjectMember}
          >
            {projectMembers.map((member, index) => (
              <ProjectMemberInTaskCard key={index} Data={member} TaskID={taskID} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {dialogAction === 'delete' && 'Are you sure you want to delete this task?'}
            {dialogAction === 'resetStart' && 'Reset the start date of this task?'}
            {dialogAction === 'resetDelivery' && 'Reset the delivery date of this task?'}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDialogConfirm} variant="contained" color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
