import React, { useState, useCallback, useEffect } from 'react'
import { Container, Typography, Box, Divider } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import AddServiceForm from '../components/AddServiceForm'
import MyServicesList from '../components/MyServicesList'
import { getMyServices } from '../api';

const TenantDashboard = () => {
  const { user } = useAuth()
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getMyServices();
      setServices(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch services.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

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
      <Container>
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Tenant Dashboard
          </Typography>
          <Typography variant="h6">Welcome, {user?.businessName || user?.email}!</Typography>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Add a New Service
          </Typography>
          <AddServiceForm onServiceAdded={fetchServices} />
        </Box>

        <Divider sx={{ my: 4 }} />

        <MyServicesList services={services} loading={loading} error={error} onServiceDeleted={fetchServices} />
      </Container>
    </Box>
  )
}

export default TenantDashboard
