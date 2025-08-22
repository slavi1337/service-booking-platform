import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { getServiceById, updateService, getAllCategories } from '../api';

const serviceSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  categoryId: z.number({ required_error: 'Category is required.' }).positive('Please select a category.'),
  description: z.string().optional(),
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
});

const EditServicePage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      price: '',
      durationInMinutes: '',
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [serviceResponse, categoriesResponse] = await Promise.all([
          getServiceById(serviceId),
          getAllCategories(),
        ]);

        const serviceData = serviceResponse.data;
        const allCategories = categoriesResponse.data;
        setCategories(allCategories);

        const currentCategory = allCategories.find(cat => cat.name === serviceData.category);

        reset({
          name: serviceData.name,
          categoryId: currentCategory ? currentCategory.id : '',
          description: serviceData.description,
          price: serviceData.price,
          durationInMinutes: serviceData.durationInMinutes,
        });

      } catch (err) {
        setError('Failed to fetch service data or categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serviceId, reset]);

  const onSubmit = async (data) => {
    setError(null);
    setSuccessMessage('');
    try {
      await updateService(serviceId, data);
      setSuccessMessage('Service updated successfully!');
      setTimeout(() => navigate('/tenant-dashboard'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update service.');
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  if (error)
    return (
      <Alert severity="error" sx={{ m: 4 }}>
        {error}
      </Alert>
    );

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
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Service
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outlined" onClick={() => navigate('/tenant-dashboard')}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditServicePage;