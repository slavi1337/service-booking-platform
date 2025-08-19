import React, { useState, useEffect } from 'react'

import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  CssBaseline,
  Paper,
  Box,
} from '@mui/material'
import { useParams, Link as RouterLink } from 'react-router-dom'

import { getServicesByTenant } from '../api'

const TenantServicesPage = () => {
  const { tenantId } = useParams()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServicesByTenant(tenantId)
        setServices(response.data)
      } catch (err) {
        setError('Failed to fetch services for this provider.')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [tenantId])

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />
  if (error) return <Alert severity="error">{error}</Alert>

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
        <Breadcrumbs aria-label="breadcrumb" sx={{ my: 2 }}>
          <Link color="inherit" component={RouterLink} to="/" underline="hover">
            Home
          </Link>
          <Link color="inherit" component={RouterLink} to="/dashboard" underline="hover">
            Providers
          </Link>
          <Typography color="text.primary">Services</Typography>
        </Breadcrumbs>

        <Typography gutterBottom variant="h4">
          Available Services
        </Typography>

        {services.length === 0 ? (
          <Typography>This provider has no services available.</Typography>
        ) : (
          <List>
            {services.map((service) => (
              <ListItem disablePadding key={service.id}>
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
    </Box>
  )
}

export default TenantServicesPage
