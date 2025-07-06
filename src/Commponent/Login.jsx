import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import Typography from '@mui/material/Typography';
import PasswordIcon from '@mui/icons-material/Password';
import { Link, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { LoginAPI } from '../Utility/connection';

export default function Login() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState('');
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const navigate = useNavigate();

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please fill in both email and password.');
            setOpenSnackbar(true);
            return;
        }

        try {
            const response = await LoginAPI('User/Login', JSON.stringify({ email, password }));

            if (response.ok) {
                navigate('/home');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed. Please check your credentials.');
                setOpenSnackbar(true);
            }
        } catch (err) {
            setError('Network error. Please try again later.');
            setOpenSnackbar(true);
        }
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ color: "#001b39" }}>
                <Box sx={{ bgcolor: '#cfe8fc', width: '70vw', height: '70vh', display: 'flex' }}>
                    <Box sx={{
                        minWidth: '50%', minHeight: '100%',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'flex-start', px: 2,
                        justifyContent: 'center', gap: '30px'
                    }}>
                        <Typography variant="h4" gutterBottom>Login</Typography>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                            <LocalPostOfficeIcon color='primary' sx={{ mr: 1, my: 0.5 }} />
                            <TextField
                                fullWidth type='email' label="Email"
                                variant="standard" value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                            <PasswordIcon color='primary' sx={{ mr: 1, my: 0.5 }} />
                            <TextField
                                fullWidth type='password' label="Password"
                                variant="standard" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Box>

                        <Link to="#">Forgot password?</Link>

                        <Box sx={{
                            display: 'flex', flexDirection: 'column',
                            gap: '20px', width: '100%', marginTop: '20px'
                        }}>
                            <Button
                                color='primary'
                                variant="contained"
                                disableElevation
                                onClick={handleLogin}
                                sx={(theme) => ({
                                    color: theme.palette.btncolor?.main || "#fff",
                                    width: '100%'
                                })}
                            >
                                Login
                            </Button>

                            <Typography variant="body2">
                                Don't have an account? <Link to="/register">Signup Now</Link>
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{
                        position: 'relative', minWidth: '50%', minHeight: '100%',
                        display: { xs: 'none', sm: 'block' }, overflow: 'hidden'
                    }}>
                        <img
                            src="https://wallpapercave.com/wp/wp9140162.jpg"
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />

                        <Box sx={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                            bgcolor: 'rgba(0, 0, 0, 0.5)', color: 'white',
                            display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 2
                        }}>
                            <Typography variant="h4" fontWeight="bold" gutterBottom>
                                Get more done with your team!
                            </Typography>
                            <Typography variant="body1" sx={{ maxWidth: '80%' }}>
                                A simple platform to manage projects and talk with your team — organize tasks, share ideas, and track progress easily.
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Snackbar Alert for errors */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={5000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert severity="error" onClose={handleSnackbarClose} sx={{ width: '100%' }}>
                        {error}
                    </Alert>
                </Snackbar>
            </Container>
        </React.Fragment>
    );
}
