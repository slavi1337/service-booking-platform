import React from 'react';
import { Container, Typography, Box, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import AddServiceForm from '../components/AddServiceForm';
import MyServicesList from '../components/MyServicesList';

const TenantDashboard = () => {
    const { user } = useAuth();

    return (
        <Container>
            <Box sx={{ my: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Tenant Dashboard
                </Typography>
                <Typography variant="h6">
                    Welcome, {user?.businessName || user?.email}!
                </Typography>
            </Box>

            <Box>
                <Typography variant="h5" gutterBottom>
                    Add a New Service
                </Typography>
                <AddServiceForm />
            </Box>

            <Divider sx={{ my: 4 }} />

            <MyServicesList />
        </Container>
    );
};

export default TenantDashboard;