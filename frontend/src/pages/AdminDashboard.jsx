import React, { useState, useEffect } from 'react';

import { Box, Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';

import { getAllUsers, lockUser, unlockUser, deleteUser } from '../api';

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
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ my: 4 }}>Admin Dashboard - User Management</Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
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
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
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
        </Container>
    );
};

export default AdminDashboard;