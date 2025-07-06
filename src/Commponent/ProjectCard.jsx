import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Chip } from '@mui/material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonIcon from '@mui/icons-material/Person';
export default function ProjectCard({ Name, Role, Status }) {
    return (
        <Card
            sx={{
                minWidth: 275,
                minHeight: 180,
                borderRadius: 3,
                boxShadow: 4,
                p: 2,
                background: 'white',
                color: 'black',
                transition: 'transform 0.3s',
                '&:hover': {
                    transform: 'scale(1.03)',
                },
            }}
        >
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                    <AssignmentTurnedInIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    {Name}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    <Typography variant="body1" color="black">
                        Role: <b>{getRole(Role)}</b>
                    </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Chip
                        label={Status}
                        color={getStatusColor(Status)}
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                    />
                </Box>
            </CardContent>
        </Card>
    )
}

function getRole(role) {
    switch (+role) {
        case 1:
            return 'Member';
        case 2:
            return 'Owner';
        case 3:
            return 'Leader';
        default:
            return 'warning';
    }
}

const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case 'new':
            return 'primary';      // لون أزرق أو شيء يدل على جديد
        case 'in progress':
            return 'info';         // لون أزرق فاتح (يدل على تقدم العمل)
        case 'completed':
            return 'success';      // أخضر (يدل على النجاح/الإكتمال)
        case 'cancelled':
            return 'error';        // أحمر (يدل على الإلغاء أو المشكلة)
        default:
            return 'warning';      // برتقالي لحالات غير معروفة
    }
};
