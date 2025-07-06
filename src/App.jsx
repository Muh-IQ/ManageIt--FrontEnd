import './App.css'
import { purple } from '@mui/material/colors';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';

import { Routes, Route } from 'react-router-dom';
import Login from './Commponent/Login';
import Register from './Commponent/Register';
import Home from './Commponent/Home';
import ProjectDetails from './Commponent/ProjectDetails';
import AddPoject from './Commponent/AddPoject';
import UpdateProject from './Commponent/UpdateProject';
import TaskList from './Commponent/TaskList';
import UpdateTask from './Commponent/UpdateTask';
import AddTask from './Commponent/AddTask';
import TaskDetails from './Commponent/TaskDetails';

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(49 88 100)",
    },
    secondary: purple,
    background: {
      default: "#001b39",
    },
    btncolor: {
      main: '#10fc9a',
      contrastText: '#000000',
    }
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#001b39',
          color: '#fff',
          margin: 0,
          padding: 0,
        },
      },
    },
  },
});


function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* <UpdateTask/> */}
      {/* <Home /> */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/AddNewPoject" element={<AddPoject />} />
        <Route path="/ProjectDetails" element={<ProjectDetails />} />
        <Route path="/ProjectDetails/UpdateProject" element={<UpdateProject />} />
        <Route path="/ProjectDetails/TaskList" element={<TaskList/>} />
        <Route path="/ProjectDetails/TaskList/UpdateTask" element={<UpdateTask/>} />
        <Route path="/ProjectDetails/TaskList/AddTask" element={<AddTask/>} />
        <Route path="/ProjectDetails/TaskDetails" element={<TaskDetails/>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;

