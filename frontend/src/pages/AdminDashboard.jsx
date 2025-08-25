import React, { useState, useEffect } from 'react';

import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

import { getAllUsers, lockUser, unlockUser, deleteUser } from '../api';
import UserTableHead from '../components/UserTableHead';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (err) { setError("Failed to fetch users."); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleLock = async (userId, isActive) => {
        try {
            isActive ? await lockUser(userId) : await unlockUser(userId);
            fetchUsers();
        } catch (err) { alert("Action failed."); }
    };

    const handleDelete = async (userId) => {
        if (window.confirm("Are you sure you want to permanently delete this user?")) {
            try {
                await deleteUser(userId);
                fetchUsers();
            } catch (err) { alert("Deletion failed."); }
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                width: '100vw',
                backgroundImage: 'url(/login.jpeg)',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                <Paper sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography sx={{ mb: 4, textAlign: 'center' }} variant="h4">
                        Admin Dashboard - User Management
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <UserTableHead />
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.id}</TableCell>
                                        <TableCell>{user.businessName || `${user.firstName} ${user.lastName}`}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role.replace('ROLE_', '')}</TableCell>
                                        <TableCell>{user.isActive ? 'Active' : 'Locked'}</TableCell>
                                        <TableCell align="right">
                                            <Button onClick={() => handleToggleLock(user.id, user.isActive)} sx={{ mr: 1 }}>
                                                {user.isActive ? 'Lock' : 'Unlock'}
                                            </Button>
                                            <Button color="error" onClick={() => handleDelete(user.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ mb: 4, textAlign: 'center' }}>
                        <Typography gutterBottom variant="h5">
                            Content Management
                        </Typography>
                        <Button
                            component={Link}
                            to="/admin/categories"
                            variant="contained"
                        >
                            Manage Categories
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
};

export default AdminDashboard;