import React, { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TextField, Button, Box, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useAuth } from '../context/AuthContext'
import { createService, getAllCategories } from '../api'

const serviceSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  categoryId: z.number({ required_error: 'Category is required.' }).positive('Please select a category.'), description: z.string().optional(),
  price: z.preprocess(
    (val) => parseFloat(String(val)),
    z.number({ invalid_type_error: 'Price must be a number.' }).positive('Price must be positive.'),
  ),
  durationInMinutes: z.preprocess(
    (val) => parseInt(String(val), 10),
    z
      .number({ invalid_type_error: 'Duration must be a number.' })
      .int()
      .positive('Duration must be a positive integer.'),
  ),
})

const AddServiceForm = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      categoryId: null,
      description: '',
      price: '',
      durationInMinutes: '',
    },
  })

  const { user } = useAuth()
  const [serverError, setServerError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setServerError("Could not load categories. Please try refreshing the page.");
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data) => {
    setServerError(null)
    setSuccessMessage('')

    if (!user || user.role !== 'ROLE_TENANT' || !user.id) {
      setServerError('You must be logged in as a Service Provider to add a service.')
      return
    }

    try {
      const { categoryId, ...serviceData } = data;
      await createService(serviceData, user.id, categoryId);

      setSuccessMessage('Service created successfully!');
      reset();

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create service.')
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {serverError}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Service Name"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
      <FormControl fullWidth margin="normal" error={!!errors.categoryId}>
        <InputLabel id="category-select-label">Category</InputLabel>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              labelId="category-select-label"
              label="Category"
            >
              <MenuItem value="" disabled>
                <em>Select a category</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.categoryId && (
          <p style={{ color: '#d32f2f', fontSize: '0.75rem', margin: '3px 14px 0' }}>
            {errors.categoryId.message}
          </p>
        )}
      </FormControl>
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Description (Optional)"
            variant="outlined"
            margin="normal"
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
        )}
      />
      <Controller
        name="price"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Price (€)"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="number"
            error={!!errors.price}
            helperText={errors.price?.message}
          />
        )}
      />
      <Controller
        name="durationInMinutes"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Duration (minutes)"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            type="number"
            error={!!errors.durationInMinutes}
            helperText={errors.durationInMinutes?.message}
          />
        )}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2 }} disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Service'}
      </Button>
    </Box>
  )
}

export default AddServiceForm
