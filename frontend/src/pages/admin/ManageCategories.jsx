import React, { useState, useEffect } from 'react';

import { TextField, Button, Box, Typography, List, ListItem, ListItemText } from '@mui/material';

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
        <Box sx={{ p: 3 }}>
            <Typography gutterBottom variant="h5">Manage Categories</Typography>
            <Box component="form" onSubmit={handleAddCategory} sx={{ mb: 4, display: 'flex', gap: 2 }}>
                <TextField
                    label="New Category"
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    size="small"
                    value={newCategoryName}
                    variant="outlined"
                />
                <Button type="submit" variant="contained">Add</Button>
            </Box>
            <Typography variant="h6">Existing Categories</Typography>
            <List>
                {categories.map((category) => (
                    <ListItem key={category.id}>
                        <ListItemText primary={category.name} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};

export default ManageCategories;