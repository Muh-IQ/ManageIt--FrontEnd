import * as React from 'react';
import { Card, CardContent, Avatar, Typography, Button, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

export default function MemberCard() {
    const [permission, setPermission] = React.useState('');

    const handleChange = (event) => {
        setPermission(event.target.value);
    };

    return (
        <Card sx={{ mb: 2 }}>
            <CardContent
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 2,
                    paddingBottom: '16px !important',
                }}
            >
                <Avatar src={"member.imagePath"} sx={{ width: 56, height: 56 }} />

                <Box sx={{ flex: '1 1 auto', minWidth: '150px' }}>
                    <Typography
                        variant="subtitle1"
                        sx={{ fontSize: { xs: '14px', sm: '16px' } }}
                    >
                        Muh12@gg
                    </Typography>
                    <Typography
                        color="text.secondary"
                        sx={{ fontSize: { xs: '12px', sm: '14px' } }}
                    >
                        Owner
                    </Typography>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: 1,
                        ml: { xs: 0, sm: 'auto' },
                        mt: { xs: 2, sm: 0 },
                        pl: { sm: 2 },
                        borderLeft: { sm: '1px solid black' }
                    }}
                >
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
                        sx={{ height: "36px", width: { xs: '100%', sm: 'auto' }, fontSize: { xs: '13px' } }}
                    >
                        Change
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
}
