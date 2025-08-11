import React, { useState, useEffect } from 'react'

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  ListItemButton,
} from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

import { getMyServices } from '../api'

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
            <ListItem disablePadding key={service.id}>
              <ListItemButton component={RouterLink} to={`/services/${service.id}`}>
                <ListItemText
                  primary={service.name}
                  secondary={`${service.category} - ${service.durationInMinutes} min - ${service.price}€`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default MyServicesList
