import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import { deleteService } from '../api';

const MyServicesList = ({ services, loading, error, onServiceDeleted }) => {
  const navigate = useNavigate();

  const handleDelete = async (serviceId, serviceName) => {
    if (window.confirm(`Are you sure you want to delete the service "${serviceName}"? This will also delete all associated bookings.`)) {
      try {
        await deleteService(serviceId);
        if (onServiceDeleted) {
          onServiceDeleted();
        }

      } catch (err) {
        alert('Failed to delete service.');
      }
    }
  };

  const handleEdit = (serviceId) => {
    navigate(`/edit-service/${serviceId}`);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ mt: 4 }}>
      <Typography gutterBottom variant="h5">
        Your Current Services
      </Typography>
      {!services || services.length === 0 ? (
        <Typography>You haven't added any services yet.</Typography>
      ) : (
        <List>
          {services.map((service) => (
            <ListItem
              disablePadding
              key={service.id}
              secondaryAction={
                <Box>
                  <IconButton aria-label="edit" edge="end" onClick={() => handleEdit(service.id)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" edge="end" onClick={() => handleDelete(service.id, service.name)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
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
      )}
    </Box>
  );
};

export default MyServicesList;  