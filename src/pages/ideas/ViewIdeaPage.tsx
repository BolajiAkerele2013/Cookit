import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuthStore } from '../../store/authStore';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  equityPercentage?: number;
  debtAmount?: number;
  contractDuration?: string;
}

export const ViewIdeaPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Mock data - replace with API call
  const idea = {
    id: '1',
    name: 'Sample Idea',
    description: 'Detailed description of the idea...',
    problemCategory: 'Technology',
    solution: 'Proposed solution details...',
    visibility: 'private',
    ownerId: user?.id,
    createdAt: new Date().toISOString(),
    team: [
      {
        id: '1',
        name: 'John Doe',
        role: 'IDEA_OWNER',
        equityPercentage: 60
      },
      {
        id: '2',
        name: 'Jane Smith',
        role: 'EQUITY_OWNER',
        equityPercentage: 40
      },
      {
        id: '3',
        name: 'Bob Johnson',
        role: 'DEBT_FINANCIER',
        debtAmount: 50000
      },
      {
        id: '4',
        name: 'Alice Brown',
        role: 'CONTRACTOR',
        contractDuration: '6 months'
      },
      {
        id: '5',
        name: 'Charlie Wilson',
        role: 'VIEWER'
      }
    ] as TeamMember[]
  };

  React.useEffect(() => {
    // TODO: Fetch idea details
    setLoading(false);
  }, [id]);

  const getRoleDisplay = (member: TeamMember) => {
    let details = '';
    if (member.equityPercentage !== undefined) {
      details = ` (${member.equityPercentage}% equity)`;
    } else if (member.debtAmount !== undefined) {
      details = ` ($${member.debtAmount.toLocaleString()} invested)`;
    } else if (member.contractDuration !== undefined) {
      details = ` (${member.contractDuration})`;
    }
    return member.role.replace('_', ' ') + details;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">
            {idea.name}
          </Typography>
          {idea.ownerId === user?.id && (
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/ideas/${id}/edit`)}
            >
              Edit
            </Button>
          )}
        </Box>

        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="textSecondary">
              Category
            </Typography>
            <Typography variant="h6">
              {idea.problemCategory}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="textSecondary">
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {idea.description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="textSecondary">
              Solution
            </Typography>
            <Typography variant="body1" paragraph>
              {idea.solution}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="h6" gutterBottom>
              Team Members
            </Typography>
            <TableContainer component={Card} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {idea.team.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
                        <Chip 
                          label={getRoleDisplay(member)}
                          color={member.role === 'IDEA_OWNER' ? 'primary' : 
                                member.role === 'EQUITY_OWNER' ? 'success' :
                                member.role === 'DEBT_FINANCIER' ? 'secondary' :
                                member.role === 'CONTRACTOR' ? 'warning' : 'default'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Divider />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Chip
              label={idea.visibility}
              color={idea.visibility === 'public' ? 'success' : 'default'}
            />
            <Typography variant="caption" color="textSecondary">
              Created: {new Date(idea.createdAt).toLocaleDateString()}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="flex-end">
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};
