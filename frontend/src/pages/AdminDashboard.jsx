import React from 'react';
import { Container, Typography } from '@mui/material';

const AdminDashboard = () => {
    return (
        <Container>
            <Typography variant="h4" sx={{ mt: 4 }}>
                Admin Dashboard
            </Typography>
            <Typography>
                Welcome, Admin! Here you can manage users and system settings.
            </Typography>
        </Container>
    );
};

export default AdminDashboard;