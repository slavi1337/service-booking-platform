import React, { useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  ListItemButton,
  IconButton
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { getMyServices, deleteService } from '../api'

const MyServicesList = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchMyServices = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getMyServices();
        setServices(response.data);
      } catch (err) {
        setError("Failed to fetch your services.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyServices();
  }, []);

  const handleDelete = async (serviceId, serviceName) => {
    if (window.confirm(`Are you sure you want to delete the service "${serviceName}"? This will also delete all associated bookings.`)) {
      try {
        await deleteService(serviceId);
        setServices(currentServices => currentServices.filter(s => s.id !== serviceId));
      } catch (err) {
        alert('Failed to delete service.');
      }
    }
  };

  if (loading) return <CircularProgress />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box sx={{ mt: 4 }}>
      <Typography gutterBottom variant="h5">
        Your Current Services
      </Typography>
      {services.length === 0 ? (
        <Typography>You haven't added any services yet.</Typography>
      ) : (
        <List>
          {services.map((service) => (

            <ListItem
              key={service.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(service.id, service.name)}>
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >

              <ListItemButton component={RouterLink} to={`/services/${service.id}`}>
                <ListItemText
                  primary={service.name}
                  secondary={`${service.category} - ${service.durationInMinutes} min - ${service.price}€`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )
      }
    </Box>
  )
}

export default MyServicesList
