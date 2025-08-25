import React from 'react';
import {
    TableHead,
    TableRow,
    TableCell,
} from '@mui/material';

const UserTableHead = () => {
    return (
        <TableHead>
            <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
            </TableRow>
        </TableHead>
    );
};

export default UserTableHead;