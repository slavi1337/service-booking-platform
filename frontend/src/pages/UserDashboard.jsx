import React, { useState, useEffect } from 'react'

import CategoryIcon from '@mui/icons-material/Category'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import PeopleIcon from '@mui/icons-material/People'
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  CardActionArea,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import { getAllTenants, getAllCategories, getServicesByCategory } from '../api'

const CategoryAccordion = ({ category }) => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const fetchServices = async () => {
    if (services.length > 0 || !isOpen) return
    setLoading(true)
    try {
      const response = await getServicesByCategory(category.name)
      setServices(response.data)
    } catch (error) {
      console.error('Failed to fetch services for category', category.name)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchServices()
    }
  }, [isOpen])

  return (
    <Accordion onChange={(e, expanded) => setIsOpen(expanded)}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{category.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Grid container spacing={2}>
            {services.length > 0 ? (
              services.map((service) => (
                <Grid item key={service.serviceId} md={4} sm={6} xs={12}>
                  <Card>
                    <CardContent>
                      <Typography fontWeight="bold" variant="subtitle1">
                        {service.serviceName}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {service.tenantName}
                      </Typography>
                      <Box mt={1}>
                        <Button
                          onClick={() => navigate(`/services/${service.serviceId}`)}
                          size="small"
                        >
                          Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography>There are no services in this category</Typography>
            )}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  )
}

const UserDashboard = () => {
  const [filter, setFilter] = useState('tenants')
  const [tenants, setTenants] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [tenantsResponse, categoriesResponse] = await Promise.all([
          getAllTenants(),
          getAllCategories(),
        ])
        setTenants(tenantsResponse.data)
        setCategories(categoriesResponse.data)
      } catch (err) {
        setError('Failed to fetch data.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter)
    }
  }

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Container>
      <Typography gutterBottom sx={{ my: 4 }} variant="h4">
        Services
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          aria-label="Filter by tenants or categories"
          color="primary"
          exclusive
          onChange={handleFilterChange}
          value={filter}
        >
          <ToggleButton value="tenants">
            <PeopleIcon sx={{ mr: 1 }} />
            By Tenants
          </ToggleButton>
          <ToggleButton value="categories">
            <CategoryIcon sx={{ mr: 1 }} />
            By Categories
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {filter === 'tenants' ? (
        <Grid container direction="column" spacing={3}>
          {tenants.map((tenant) => (
            <Grid item key={tenant.id} xs={12}>
              <Card>
                <CardActionArea component={RouterLink} to={`/tenants/${tenant.id}/services`}>
                  <CardContent>
                    <Typography component="div" variant="h5">
                      {tenant.businessName || `${tenant.firstName} ${tenant.lastName}`}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {tenant.businessDescription}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          {categories.map((category) => (
            <CategoryAccordion category={category} key={category.name} />
          ))}
        </Box>
      )}
    </Container>
  )
}
export default UserDashboard
