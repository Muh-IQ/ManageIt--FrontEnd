import MemberCard from './MemberCard'
import { Box, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import * as React from 'react';

export default function TaskMembers() {
    const [permission, setPermission] = React.useState('');

    const handleChange = (event) => {
        setPermission(event.target.value);
    }

    return (
        <Box
            sx={{
                p: '10px',
                border: 'solid 1px white',
                height: '90vh',
                overflowY: 'auto'
            }}
        >
            <CardContent
                sx={{
                    bgcolor: 'white',
                    display: "flex",
                    flexWrap: 'wrap',
                    alignItems: "center",
                    gap: 2,
                    height: 'auto',
                    paddingBottom: '16px !important',
                    marginBottom: '16px'
                }}
            >
                <TextField
                    id="standard-basic"
                    label="Email"
                    variant="standard"
                    type='email'
                    size="small"
                    sx={{ minWidth: { xs: '100%', sm: '200px' }, fontSize: { xs: '14px' } }}
                />

                <FormControl
                    variant="standard"
                    size="small"
                    sx={{ minWidth: { xs: '100%', sm: 120 } }}
                >
                    <InputLabel id="demo-simple-select-standard-label">Permission</InputLabel>
                    <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={permission}
                        onChange={handleChange}
                        label="Permission"
                        fullWidth
                        sx={{ fontSize: { xs: '14px' } }}
                    >
                        <MenuItem value={1}>Member</MenuItem>
                        <MenuItem value={3}>TaskLeader</MenuItem>
                    </Select>
                </FormControl>

                <Button
                    variant="outlined"
                    size="small"
                    sx={{ width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '13px' } }}
                >
                    Add
                </Button>
            </CardContent>

            {/* Member Cards */}
            <MemberCard />
            <MemberCard />
            <MemberCard />
            <MemberCard />
            <MemberCard />
            <MemberCard />
            <MemberCard />
            <MemberCard />
            <MemberCard />
        </Box>
    )
}

