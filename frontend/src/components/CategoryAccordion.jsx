import React, { useState } from 'react'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

import { getServicesByCategory } from '../api'

const CategoryAccordion = ({ category }) => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fetchServices = async () => {
    if (services.length > 0) return
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

  return (
    <Accordion onChange={fetchServices}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{category.name}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {loading ? (
          <CircularProgress />
        ) : (
          <Grid container spacing={2}>
            {services.map((service) => (
              <Grid item key={service.serviceId} md={4} sm={6} xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1">{service.serviceName}</Typography>
                    <Typography color="text.secondary">{service.tenantName}</Typography>
                    <Button onClick={() => navigate(`/services/${service.serviceId}`)} size="small">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </AccordionDetails>
    </Accordion>
  )
}
export default CategoryAccordion
