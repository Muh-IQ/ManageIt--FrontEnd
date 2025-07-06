import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LocalPostOfficeIcon from '@mui/icons-material/LocalPostOffice';
import Typography from '@mui/material/Typography';
import PasswordIcon from '@mui/icons-material/Password';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { Link } from 'react-router-dom';
import { PostWithoutAuth } from '../Utility/connection';

function OTPInput({ onSubmit, email }) {
    const [otp, setOtp] = React.useState(new Array(6).fill(""));
    const inputsRef = React.useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/g, ''); // أرقام فقط
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < pasted.length; i++) {
            newOtp[i] = pasted[i];
            if (inputsRef.current[i]) {
                inputsRef.current[i].value = pasted[i];
            }
        }
        setOtp(newOtp);
    };

    const handleSubmit = async () => {
        if (otp.some(val => val === "")) {
            alert("Please fill in all digits");
            return;
        }


        try {
            const data = JSON.stringify({
                email: email,
                otp: otp.join("")
            })

            const response = await PostWithoutAuth('OTP/VerifyOTP', data);
            if (response.ok) {
                onSubmit(true, 'OTP verified successfully!');
            } else {
                onSubmit(false, 'OTP verification failed');
            }
        } catch (error) {
            onSubmit(false, 'Error verifying OTP');
        }
    };

    return (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom>
                Enter the 6-digit OTP sent to {email}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }} onPaste={handlePaste}>
                {otp.map((data, index) => (
                    <TextField
                        key={index}
                        inputRef={ref => inputsRef.current[index] = ref}
                        inputProps={{
                            inputMode: "numeric",
                            maxLength: 1,
                            style: {
                                textAlign: 'center',
                                fontSize: '24px',
                                width: '48px',
                                height: '48px',
                            },
                        }}
                        type="text"
                        onChange={(e) => handleChange(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        onInput={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '');
                        }}
                        variant="outlined"
                    />
                ))}
            </Box>
            <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ mt: 3, px: 5 }}
            >
                Verify
            </Button>
        </Box>
    );
}

export default function Register() {
    const [avatarSrc, setAvatarSrc] = React.useState(undefined);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [image, setImage] = React.useState(null);
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'error' });
    const [emailUsed, setEmailUsed] = React.useState(false);
    const [invalidEmailFormat, setInvalidEmailFormat] = React.useState(false);
    const [registrationSuccess, setRegistrationSuccess] = React.useState(false);
    const [otpVerified, setOtpVerified] = React.useState(false);

    const isValidEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setSnackbar({ open: true, message: 'Please upload a valid image file.', severity: 'warning' });
                event.target.value = null;
                setAvatarSrc(undefined);
                setImage(null);
                return;
            }
            const reader = new FileReader();
            reader.onload = () => {
                setAvatarSrc(reader.result);
            };
            reader.readAsDataURL(file);
            setImage(file);
        }
    };

    const handleEmailBlur = async () => {
        if (!email) return;

        if (!isValidEmailFormat(email)) {
            setInvalidEmailFormat(true);
            setSnackbar({ open: true, message: 'Invalid email format.', severity: 'warning' });
            return;
        }

        setInvalidEmailFormat(false);

        try {
            const res = await PostWithoutAuth('User/IsEmailVerifiedExists', JSON.stringify({ email }));
            const isUsed = await res.json();
            if (isUsed) {
                setEmailUsed(true);
                setSnackbar({ open: true, message: 'Email already used. Please choose another.', severity: 'error' });
            } else {
                setEmailUsed(false);
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error checking email availability.', severity: 'error' });
        }
    };

    const sendOTP = async (email) => {
        try {
            const data = JSON.stringify({
                email: email
            })
            const response = await PostWithoutAuth('OTP/AddOTP', data);

            if (!response.ok) {
                throw new Error('Failed to send OTP');
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Error sending OTP', severity: 'error' });
        }
    };

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword || !username || !image) {
            setSnackbar({ open: true, message: 'All fields are required.', severity: 'error' });
            return;
        }

        if (!isValidEmailFormat(email)) {
            setSnackbar({ open: true, message: 'Invalid email format.', severity: 'error' });
            return;
        }

        if (emailUsed) {
            setSnackbar({ open: true, message: 'Please change your email.', severity: 'error' });
            return;
        }
        if (password !== confirmPassword) {
            setSnackbar({ open: true, message: 'Passwords do not match.', severity: 'error' });
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('username', username);
        formData.append('image', image);

        try {
            const res = await fetch('https://manageit.tryasp.net/api/User/AddNewUser', {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                setRegistrationSuccess(true);
                await sendOTP(email);
                setSnackbar({ open: true, message: 'Registered successfully. Please check your email for OTP.', severity: 'success' });
            } else {
                setSnackbar({ open: true, message: 'Registration failed.', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: 'Something went wrong.', severity: 'error' });
        }
    };

    const handleOTPVerification = (success, message) => {
        if (success) {
            setOtpVerified(true);
            setSnackbar({ open: true, message: message, severity: 'success' });
            // يمكنك هنا توجيه المستخدم إلى صفحة الدخول أو الصفحة الرئيسية
        } else {
            setSnackbar({ open: true, message: message, severity: 'error' });
        }
    };

    const isPasswordMatch = password && confirmPassword && password !== confirmPassword;

    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ color: "#001b39" }}>
                <Box sx={{ bgcolor: '#cfe8fc', width: '70vw', minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {!registrationSuccess ? (
                        <Box sx={{ display: 'flex', flex: 1 }}>
                            <Box sx={{ minWidth: '50%', minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', px: 2, justifyContent: 'center', gap: '15px' }}>
                                <Typography variant="h4" gutterBottom>Register</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                                    <LocalPostOfficeIcon color='primary' sx={{ mr: 1, my: 0.5 }} />
                                    <TextField
                                        fullWidth
                                        type='email'
                                        label="Email"
                                        variant="standard"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onBlur={handleEmailBlur}
                                        error={emailUsed || invalidEmailFormat}
                                        helperText={invalidEmailFormat ? 'Invalid email format' : emailUsed ? 'Email already used' : ''}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                                    <PasswordIcon color='primary' sx={{ mr: 1, my: 0.5 }} />
                                    <TextField
                                        fullWidth
                                        type='password'
                                        label="Password"
                                        variant="standard"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                                    <PasswordIcon color='primary' sx={{ mr: 1, my: 0.5 }} />
                                    <TextField
                                        fullWidth
                                        type='password'
                                        label="Confirm Password"
                                        variant="standard"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        error={isPasswordMatch}
                                        helperText={isPasswordMatch ? 'Passwords do not match' : ''}
                                    />
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '100%' }}>
                                    <AssignmentIndIcon color='primary' sx={{ mr: 1, my: 0.5 }} />
                                    <TextField
                                        fullWidth
                                        type='text'
                                        label="Username"
                                        variant="standard"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Box>
                                <Box>
                                    <ButtonBase component="label">
                                        <Avatar alt="Upload avatar" src={avatarSrc} />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            onChange={handleAvatarChange}
                                        />
                                    </ButtonBase>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', marginTop: '20px' }}>
                                    <Button
                                        variant="contained"
                                        onClick={handleRegister}
                                        disabled={emailUsed}
                                        sx={(theme) => ({ color: theme.palette.btncolor?.main, width: '100%' })}
                                    >
                                        Register
                                    </Button>
                                    <Typography variant="body2">
                                        Do you have an account? <Link to="/">Login Now</Link>
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ position: 'relative', minWidth: '50%', minHeight: '100%', display: { xs: 'none', sm: 'block' }, overflow: 'hidden' }}>
                                <img src="https://wallpapercave.com/wp/wp9140162.jpg" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0, 0, 0, 0.5)', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', px: 2 }}>
                                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                                        Get more done with your team!
                                    </Typography>
                                    <Typography variant="body1" sx={{ maxWidth: '80%' }}>
                                        A simple platform to manage projects and talk with your team — organize tasks, share ideas, and track progress easily.
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>
                    ) : !otpVerified ? (
                        <OTPInput onSubmit={handleOTPVerification} email={email} />
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <Typography variant="h4" gutterBottom>Registration Complete!</Typography>
                            <Typography variant="body1" sx={{ mb: 3 }}>You can now login with your credentials.</Typography>
                            <Button variant="contained" component={Link} to="/">
                                Go to Login
                            </Button>
                        </Box>
                    )}
                </Box>
            </Container>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </React.Fragment>
    );
}