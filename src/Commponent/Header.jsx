import React, { useState, useEffect } from 'react';
import {
  AppBar, Box, Toolbar, IconButton, Typography, Menu, Container,
  Avatar, Tooltip, MenuItem, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Button, Snackbar, Alert
} from '@mui/material';
import { FetchFromAPI, PUTToAPI, PostToApi, PUTFormDataToAPI, clearAuthCookies } from '../Utility/connection';

const settings = ['Profile', 'Change Password', 'Logout'];

export default function Header() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const [openPasswordConfirmDialog, setOpenPasswordConfirmDialog] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);

  const [passwordInput, setPasswordInput] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [user, setUser] = useState({
    username: '',
    email: '',
    imagePath: '/static/images/avatar/2.jpg',
  });
  const [imageFile, setImageFile] = useState(null);
  const [pendingUser, setPendingUser] = useState(user);

  const fetchUser = async () => {
    const res = await FetchFromAPI(`User/GetUser`);
    const data = await res.json();
    setUser(data);
  };

  const PostPasswordMatched = async () => {
    const dataobj = {
      password: passwordInput
    };
    const res = await PostToApi(`User/IsPasswordMatched`, JSON.stringify(dataobj));
    const data = await res.json();
    return data
  };

  const PutUser = async () => {
    const formData = new FormData();
    formData.append("Email", pendingUser.email);
    formData.append("Username", pendingUser.username);
    formData.append("image", imageFile);
    const res = await PUTFormDataToAPI(`User/UpdateUser`, formData);
    return res;
  };
  const PutPassword = async () => {
    const dataobj = {
      oldPassword: currentPassword,
      newPassword: newPassword
    };
    const res = await PUTToAPI(`User/UpdatePassword`, JSON.stringify(dataobj));
    return res;
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (setting) => {
    if (setting === 'Profile') {
      setPendingUser(user);
      setOpenProfileDialog(true);
    } else if (setting === 'Change Password') {
      setOpenChangePasswordDialog(true);
    } else if (setting === 'Logout') {
      clearAuthCookies();
      window.location.href = "/";
    }
    handleCloseUserMenu();
  };

  const handleShowPasswordDialog = () => {
    setOpenProfileDialog(false);
    setOpenPasswordConfirmDialog(true);
  };

  const handleConfirmPassword = async () => {
    if (!passwordInput) {
      setSnackbar({ open: true, message: 'Please enter your password.', severity: 'error' });
      return;
    }

    const isMatched = await PostPasswordMatched();

    if (!isMatched) {
      setSnackbar({ open: true, message: 'Password does not match!', severity: 'error' });
      return;
    }
    const isUpdated = await PutUser();
    if (!isUpdated.ok) {
      setSnackbar({
        open: true,
        message: 'Failed to update profile. Please try again later.',
        severity: 'error'
      });
      return;
    }


    setOpenPasswordConfirmDialog(false);
    setPasswordInput('');
    setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });

    setTimeout(() => {
      fetchUser();
    }, 5000);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setSnackbar({ open: true, message: 'All fields are required.', severity: 'error' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match.', severity: 'error' });
      return;
    }

    const isUpdated = await PutPassword();
    if (!isUpdated.ok) {
      setSnackbar({
        open: true,
        message: 'Failed to update Password. Please try again later.',
        severity: 'error'
      });
      return;
    }


    setOpenChangePasswordDialog(false);
    setSnackbar({ open: true, message: 'Password changed successfully!', severity: 'success' });

    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      <AppBar position="static" sx={{ width: '100%' }}>
        <Container maxWidth={false}>
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box component="img" src="/l4.png" alt="ManageIt Logo"
                sx={{ width: 40, height: 40, marginRight: 2 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.2rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                ManageIt
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User" src={user.imagePath} sx={{ width: 56, height: 56 }} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={() => handleMenuClick(setting)}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Dialog: Update Profile */}
      <Dialog open={openProfileDialog} onClose={() => setOpenProfileDialog(false)}>
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
            <Avatar src={pendingUser.imagePath} sx={{ width: 80, height: 80, mb: 1 }} />
            <Button variant="outlined" component="label">
              Upload New Photo
              <input type="file" hidden onChange={(e) => {
                const file = e.target.files[0];
                setImageFile(file);
              }} />
            </Button>
          </Box>
          <TextField
            margin="dense"
            label="Username"
            fullWidth
            value={pendingUser.username}
            onChange={(e) => setPendingUser({ ...pendingUser, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={pendingUser.email}
            onChange={(e) => setPendingUser({ ...pendingUser, email: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProfileDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleShowPasswordDialog}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Confirm Password */}
      <Dialog open={openPasswordConfirmDialog} onClose={() => setOpenPasswordConfirmDialog(false)}>
        <DialogTitle>Confirm Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Please enter your current password to apply changes.
          </Typography>
          <TextField
            label="Current Password"
            type="password"
            fullWidth
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordConfirmDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmPassword}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog: Change Password */}
      <Dialog open={openChangePasswordDialog} onClose={() => setOpenChangePasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={newPassword !== confirmPassword && confirmPassword !== ''}
            helperText={newPassword !== confirmPassword && confirmPassword !== '' ? 'Passwords do not match' : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePasswordDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleChangePassword}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}
