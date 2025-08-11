import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Container, Typography, List, ListItem, ListItemButton, ListItemText, CircularProgress, Alert, Breadcrumbs, Link } from '@mui/material';
import { getServicesByTenant } from '../api';

const TenantServicesPage = () => {  
    const { tenantId } = useParams();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await getServicesByTenant(tenantId);
                setServices(response.data);
            } catch (err) {
                setError("Failed to fetch services for this provider.");
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, [tenantId]);

    if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container>
            <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
                <Link component={RouterLink} underline="hover" color="inherit" to="/">
                    Home
                </Link>
                <Link component={RouterLink} underline="hover" color="inherit" to="/dashboard">
                    Providers
                </Link>
                <Typography color="text.primary">Services</Typography>
            </Breadcrumbs>
            
            <Typography variant="h4" gutterBottom>
                Available Services
            </Typography>
            
            {services.length === 0 ? (
                <Typography>This provider has no services available.</Typography>
            ) : (
                <List>
                    {services.map(service => (
                        <ListItem key={service.id} disablePadding>
                            <ListItemButton component={RouterLink} to={`/services/${service.id}`}>
                                <ListItemText 
                                    primary={service.name} 
                                    secondary={`${service.price}€ - ${service.durationInMinutes} min`} 
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            )}
        </Container>
    );
};

export default TenantServicesPage;