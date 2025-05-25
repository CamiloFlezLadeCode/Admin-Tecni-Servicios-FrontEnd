'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import Typography from '@mui/material/Typography';

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import { string } from 'zod';
import { UserContext } from '@/contexts/user-context'; // Asegúrate de que la ruta sea correcta
import GuardarBackUp from '@/services/generales/GuardarBackUpService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  const userPopover = usePopover<HTMLDivElement>();

  // Consumir el contexto del usuario
  const { user } = React.useContext(UserContext) || { user: null };
  // Obtener el nombre del usuario, si existe
  const nombreUsuarioActivo = user ? `${user.fullName}` : null;

  //Para el manejo de la alerta
  const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
  const [mensajeAlerta, setMensajeAlerta] = React.useState('');
  const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error'>('success');

  // Función para abrir alerta
  const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error') => {
    setMensajeAlerta(mensaje);
    setTipoAlerta(tipo);
    setMostrarAlertas(true);
  };
  const RealizarBackUp = async () => {
    try {
      // Simular error manualmente, por ejemplo:
      // throw new Error('Error simulado en RealizarBackUp');
      //Simular promesa rechazada
      // await Promise.reject('Error simulado de promesa rechazada');
      const data = await GuardarBackUp();
      if (data) {
        // console.log(data);
        mostrarMensaje('BackUp guardado correctamente', 'success');
      }
    } catch (error) {
      mostrarMensaje(`Error al guardar el Backup: ${error}`, 'error');
      console.error('Error al guardar el backup: ', error);
    }
  };
  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            {/* <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip> */}
            {/* <Typography variant='h5' fontWeight="medium" color="primary">Hola,</Typography> */}
            {/* <Typography variant='h5' fontWeight="bold" color="primary">{nombreUsuarioActivo} 😊</Typography> */}
            <Typography variant="h6" color="primary">
              <span style={{ fontWeight: 500 }}>¡Hola, </span>
              <span style={{ fontWeight: 700 }}>{nombreUsuarioActivo}!</span>
            </Typography>

          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            {/* <Tooltip title="Contacts">
              <IconButton>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip> */}
            <Button style={{ fontWeight: 'bold' }} onClick={RealizarBackUp}>
              Guardar BackUp
            </Button>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              // src="/assets/avatar.png"
              src="/assets/favicon.ico"
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
        <MensajeAlerta
          open={mostrarAlertas}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
          onClose={() => setMostrarAlertas(false)}
        />
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}