import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useForm, Controller } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { roleService } from '../../services/role.service';

interface RoleForm {
  email: string;
  role: 'EQUITY_OWNER' | 'DEBT_FINANCIER' | 'CONTRACTOR' | 'VIEWER';
  equityPercentage?: number;
  debtAmount?: number;
  startDate?: string;
  endDate?: string;
}

const roleLabels = {
  IDEA_OWNER: 'Idea Owner',
  EQUITY_OWNER: 'Equity Owner',
  DEBT_FINANCIER: 'Debt Financier',
  CONTRACTOR: 'Contractor',
  VIEWER: 'Viewer'
} as const;

function ManageRolesPage() {
  // ... rest of the component code ...
}

export default ManageRolesPage;
