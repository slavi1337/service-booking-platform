import React, { useState, useEffect } from 'react';

import { TextField, Container, Paper, Button, Box, Typography, List, ListItem, ListItemText } from '@mui/material';

import { getAllCategories, createCategory } from '../../api';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const fetchCategories = async () => {
        try {
            const response = await getAllCategories();
            setCategories(response.data);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await createCategory({ name: newCategoryName });
            setNewCategoryName('');
            fetchCategories();
        } catch (error) {
            console.error("Failed to add category", error);
        }
    };

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
                <Paper sx={{ p: 4, mt: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                    <Typography gutterBottom sx={{ textAlign: 'center' }} variant="h5">
                        Manage Categories
                    </Typography>
                    <Box component="form" onSubmit={handleAddCategory} sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
                        <TextField
                            label="New Category"
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            size="small"
                            value={newCategoryName}
                            variant="outlined"
                        />
                        <Button type="submit" variant="contained">Add</Button>
                    </Box>
                    <Typography sx={{ textAlign: 'center' }} variant="h6">Existing Categories</Typography>
                    <List>
                        {categories.map((category) => (
                            <ListItem key={category.id} sx={{ textAlign: 'center' }}>
                                <ListItemText primary={category.name} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Container>
        </Box >
    );
};

export default ManageCategories;