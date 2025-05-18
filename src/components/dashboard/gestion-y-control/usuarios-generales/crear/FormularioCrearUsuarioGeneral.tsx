'use client';

import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import Input from '@/components/dashboard/componentes_generales/formulario/Input';
import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
import FormularioValidator from '@/components/dashboard/componentes_generales/formulario/ValidarCampos';
import CircularProgressWithLabel from '@/components/dashboard/componentes_generales/mensajedecarga/CircularProgressWithLabel';
import { crearCliente, verificarClienteExistenteService } from '@/services/gestionycontrol/clientes/CrearClienteService';
import TipoDocumentos from '@/services/TipoDocumentos';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { SelectChangeEvent } from '@mui/material/Select'; // Asegúrate de tener esta importación
import Grid from '@mui/material/Unstable_Grid2';
import * as React from 'react';
import { UserContext } from '@/contexts/user-context';
import { CrearUsuario } from '@/services/gestionycontrol/usuarios/CrearUsuarioService';
import { Typography } from '@mui/material';

const EstadoCliente = [
    { value: '1', label: 'Activo' },
    { value: '2', label: 'Inactivo' },
]