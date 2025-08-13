import React from 'react'

import { Card, CardContent, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

const TenantCard = ({ tenant }) => {
  const navigate = useNavigate()
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">
          {tenant.businessName || `${tenant.firstName} ${tenant.lastName}`}
        </Typography>
        <Button onClick={() => navigate(`/tenants/${tenant.id}/services`)}>View Services</Button>
      </CardContent>
    </Card>
  )
}
export default TenantCard
