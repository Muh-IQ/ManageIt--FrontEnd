import * as React from 'react';
import Box from '@mui/material/Box';
import Header from './Header';
import Chat from './Chat';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FetchFromAPI } from '../Utility/connection';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import CircleIcon from '@mui/icons-material/FiberManualRecord';

export default function ProjectDetails() {
    const [projectInfo, setProjectInfo] = useState({});
    const [projectMember, setProjectMember] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [projectCountMember, setProjectCountMember] = useState([]);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const permission = queryParams.get('per');

    const fetchProjectInfo = async () => {
        const response = await FetchFromAPI(`Project/GetProjectDetails?projectID=${id}`);
        const data = await response.json();
        setProjectInfo(data);
    };

    const fetchProjectMember = async () => {
        const response = await FetchFromAPI(`ProjectMember/GetProjectMembersPaged?ProjectID=${id}&PageNumber=1&PageSize=4`);
        const data = await response.json();
        setProjectMember(data);
    };

    const fetchCountProjectMember = async () => {
        const response = await FetchFromAPI(`ProjectMember/GetCountProjectMembers?ProjectID=${id}`);
        const data = await response.json();
        setProjectCountMember(data);
    };


    const fetchTasks = async () => {
        const response = await FetchFromAPI(`TaskList/GetTaskListsWithTasks?ProjectID=${id}`);
        const data = await response.json();
        setTasks(data);
    };
    useEffect(() => {
        fetchProjectInfo();
        fetchProjectMember();
        fetchCountProjectMember();
        fetchTasks();
    }, []);

    return (
        <React.Fragment>
            <Box sx={{ position: 'absolute', top: '0', left: '0', width: '100%' }}>
                <Header />
            </Box>

            <Box
                sx={{
                    width: '100vw',
                    marginTop: '90px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    flexDirection: {
                        xs: 'column',
                        md: 'row',
                    },
                    justifyContent: {
                        xs: 'flex-start',
                        md: permission > 1 ? 'space-between' : 'center',
                    },
                }}
            >
                {/* Sidebar */}
                <Box
                    sx={{
                        width: {
                            xs: '100%',
                            md: permission > 1 ? '25%' : '40%',
                        },
                        p: '10px',
                        transition: 'width 0.3s ease',
                    }}
                >
                    {permission > 1 && (
                        <Box>
                            <Link to={`/ProjectDetails/UpdateProject?id=${projectInfo.projectID}`}>
                                <Button variant="outlined" sx={{ margin: '10px' }} color="white">
                                    Advance
                                </Button>
                            </Link>
                            <Link to={`/ProjectDetails/TaskList?proid=${projectInfo.projectID}`}>
                                <Button variant="outlined" sx={{ margin: '10px' }} color="white">
                                    Tasks
                                </Button>
                            </Link>


                        </Box>
                    )}

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="subtitle1" component="div" sx={{ margin: 0 }}>
                            Project Members
                        </Typography>
                        <AvatarGroup
                            total={projectCountMember}
                            slotProps={{
                                additionalAvatar: {
                                    sx: { width: 30, height: 30, fontSize: '10px' },
                                },
                            }}
                            sx={{
                                '& .MuiAvatarGroup-avatar': {
                                    width: 30,
                                    height: 30,
                                },
                            }}
                        >
                            {projectMember.map((member) => (
                                <Avatar
                                    key={member.projectMemberID}
                                    alt={member.userName}
                                    src={member.imagePath}
                                    sx={{ width: 30, height: 30 }}
                                />
                            ))}
                        </AvatarGroup>
                    </Box>

                    <Typography
                        variant="h5"
                        component="h5"
                        sx={{
                            margin: '10px',
                            display: 'inline-block',
                            borderBottom: '2px solid white',
                        }}
                    >
                        Task list
                    </Typography>

                    <SimpleTreeView>
                        {tasks.map((taskList) => (
                            <TreeItem
                                key={taskList.taskListID}
                                itemId={`list-${taskList.taskListID}`}
                                label={taskList.taskListName}
                            >
                                {taskList.tasks.map((task) => {
                                    const color = getStatusColor(task.membershipStatus);

                                    const taskLabel = (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {color && <CircleIcon style={{ fontSize: 10, color }} />}
                                            {task.membershipStatus === 1 ? (
                                                <Link
                                                    to={`/ProjectDetails/TaskDetails?taskId=${task.taskID}`}
                                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                                >
                                                    {task.taskName}
                                                </Link>
                                            ) : (
                                                <span>{task.taskName}</span>
                                            )}
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

                {/* Main Content */}
                <Box
                    sx={{
                        width: {
                            xs: '100%',
                            md: permission > 1 ? '50%' : '60%',
                        },
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30px',
                        transition: 'width 0.3s ease',
                    }}
                >
                    <Box>
                        <Typography variant="h3" component="h3">
                            {projectInfo.projectName}
                        </Typography>
                        <Typography sx={{ margin: '10px 0' }} variant="h5" component="h5">
                            {projectInfo.projectStatuseName}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h5" component="h5">
                            Description
                        </Typography>
                        <Typography variant="body1" component="p" sx={{ whiteSpace: 'pre-line' }}>
                            {projectInfo.description}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h5" component="h5">
                            Requirment
                        </Typography>
                        <Typography variant="body1" component="p" sx={{ whiteSpace: 'pre-line' }}>
                            {projectInfo.requirements}
                        </Typography>
                    </Box>
                </Box>

                {/* Chat Box */}
                {permission > 1 && (
                    <Box
                        sx={{
                            width: {
                                xs: '100%',
                                md: '25%',
                            },
                            display: 'flex',
                            flexDirection: {
                                xs: 'column',
                                md: 'row-reverse',
                            },
                            paddingRight: {
                                xs: '0',
                                md: '20px',
                            },
                            transition: 'width 0.3s ease',
                        }}
                    >
                        <Chat ProjectId={id} />
                    </Box>
                )}
            </Box>
        </React.Fragment>
    );
}

const getStatusColor = (status) => {
    switch (status) {
        case 1: return 'green'; // for me
        case 2: return 'orange'; // for anthor one
        case 3: return 'red'; //  no anyone
        default: return null;
    }
};