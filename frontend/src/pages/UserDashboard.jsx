import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, CircularProgress, Alert, CardActionArea } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { getAllTenants } from '../api';

const UserDashboard = () => {
    const [tenants, setTenants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTenants = async () => {
            try {
                const response = await getAllTenants();
                setTenants(response.data);
            } catch (err) {
                setError("Failed to fetch service providers.");
            } finally {
                setLoading(false);
            }
        };
        fetchTenants();
    }, []);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container>
            <Typography variant="h4" gutterBottom sx={{ my: 4 }}>
                Service Providers
            </Typography>
            <Grid container spacing={3}>
                {tenants.map((tenant) => (
                    <Grid item key={tenant.id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardActionArea component={RouterLink} to={`/tenants/${tenant.id}/services`}>
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        {tenant.businessName}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {tenant.businessDescription}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UserDashboard;