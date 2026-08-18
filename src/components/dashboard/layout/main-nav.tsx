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
import { FloppyDisk as FloppyDiskIcon } from '@phosphor-icons/react/dist/ssr/FloppyDisk';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import Typography from '@mui/material/Typography';

import { usePopover } from '@/hooks/use-popover';
import { ColorSchemeToggle } from '@/components/core/theme-provider/color-scheme-toggle';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';
import { string } from 'zod';
import { UserContext } from '@/contexts/user-context'; // Asegúrate de que la ruta sea correcta
import GuardarBackUp from '@/services/generales/GuardarBackUpService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { MostrarAvatar } from '@/services/gestionycontrol/cuenta/MostrarAvatarService';
import Skeleton from '@mui/material/Skeleton';
import { useSocketIO } from '@/hooks/use-WebSocket';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import {
  Paper,
} from '@mui/material';
import MensajeDeCarga from '../componentes_generales/mensajedecarga/BackDropCircularProgress';
import * as AppPage from 'next/dist/build/templates/app-page';


export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  const userPopover = usePopover<HTMLDivElement>();

  // Estados para mostrar mensaje de carga
  const [mostrarMensajeDeCarga, setMostrarMensajeDeCarga] = React.useState(false);
  const [mensajeDeCarga, setMensajeDeCarga] = React.useState('');
  // ...

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
    setMostrarMensajeDeCarga(true);
    setMensajeDeCarga('Guardando Backup. Por favor espere');
    try {
      // Simular error manualmente, por ejemplo:
      // throw new Error('Error simulado en RealizarBackUp');
      //Simular promesa rechazada
      // await Promise.reject('Error simulado de promesa rechazada');
      const data = await GuardarBackUp();
      if (data) {
        setTimeout(() => {
          setMostrarMensajeDeCarga(false);
          setMensajeDeCarga('');
          mostrarMensaje('BackUp guardado correctamente', 'success');
        }, 3000);
      }
    } catch (error) {
      setMostrarMensajeDeCarga(false);
      mostrarMensaje(`Error al guardar el Backup: ${error}`, 'error');
      console.error('Error al guardar el backup: ', error);
    }
  };

  // Se captura el documento del usuario actual activo
  const DocumentoUsuarioActivo = user ? `${user.documento}` : '';
  // ...

  // Funcionalidad para motrar el avatar del usuario actual activo
  const [avatarUrl, setAvatarUrl] = React.useState('');
  const [cargandoAvatar, setCargandoAvatar] = React.useState(true);

  const CargarAvatar = async () => {
    if (DocumentoUsuarioActivo) {
      setCargandoAvatar(true);
      const url = await MostrarAvatar(DocumentoUsuarioActivo);
      setAvatarUrl(url || '/assets/AvatarDefault.png');
      setCargandoAvatar(false);
    }
  }
  React.useEffect(() => {
    CargarAvatar();
  }, [DocumentoUsuarioActivo]);
  // ...

  // Implementacion de WebSocket
  const { sendMessage, messages } = useSocketIO();
  React.useEffect(() => {
    if (messages.length > 0) {
      const ultimomensajes = messages[messages.length - 1];
      if (ultimomensajes.tipo === 'avatar-guardado') {
        CargarAvatar();
      }
    }
  }, [messages]);
  // ...
  return (
    <React.Fragment>
      <MensajeDeCarga
        Mensaje={mensajeDeCarga}
        MostrarMensaje={mostrarMensajeDeCarga}
      />
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
          // En moviles el espacio es el recurso escaso: reducimos separacion y padding
          // para que quepan hamburguesa + saludo + backup + tema + avatar.
          spacing={{ xs: 1, sm: 2 }}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: { xs: 1.5, sm: 2 } }}
        >
          {/*
            Bloque izquierdo. `minWidth: 0` es imprescindible: por defecto un hijo
            flex usa `min-width: auto`, es decir se niega a encogerse por debajo del
            ancho de su contenido. Sin esto el nombre largo no se truncaria nunca y el
            desbordamiento se lo comeria el lado derecho (empujando el avatar fuera).
          */}
          <Stack
            sx={{ alignItems: 'center', minWidth: 0, flex: '1 1 auto', overflow: 'hidden' }}
            direction="row"
            spacing={{ xs: 0.5, sm: 2 }}
          >
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              // El boton de menu nunca se comprime: es la unica via de navegacion en movil.
              sx={{ display: { lg: 'none' }, flexShrink: 0 }}
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
            {/*
              El saludo es la pieza que cede cuando falta espacio: se trunca con
              puntos suspensivos en lugar de empujar al avatar fuera de la pantalla.
              En `xs` ademas ocultamos el "¡Hola," y dejamos solo el nombre.
            */}
            <Typography
              variant="h6"
              color="primary"
              component="div"
              title={nombreUsuarioActivo ?? undefined}
              sx={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontSize: { xs: '1rem', sm: '1.125rem', md: '1.25rem' },
              }}
            >
              <Box component="span" sx={{ fontWeight: 500, display: { xs: 'none', sm: 'inline' } }}>
                ¡Hola,{' '}
              </Box>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {nombreUsuarioActivo}
              </Box>
              <Box component="span" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'inline' } }}>
                !
              </Box>
            </Typography>

          </Stack>
          {/*
            Bloque derecho. `flexShrink: 0` evita que el navegador comprima estos
            controles: sin el, el ultimo hijo (el avatar, que da acceso a cerrar
            sesion) era el primero en quedarse sin sitio.
          */}
          <Stack
            sx={{ alignItems: 'center', flexShrink: 0 }}
            direction="row"
            // Nota: el tema ya aplica `useFlexGap` a todos los Stack, asi que la
            // separacion se resuelve con `gap` y no con margenes. Es lo que permite
            // ocultar por breakpoint una de las dos versiones del boton de backup sin
            // que el hijo oculto deje un hueco fantasma.
            spacing={{ xs: 0.75, sm: 1.5, md: 2 }}
          >
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
            {/*
              El mismo comando en dos presentaciones, conmutadas con los breakpoints
              de MUI (CSS puro). No usamos deteccion de ancho en JS porque el servidor
              no conoce el viewport y romperia la hidratacion.
            */}
            <Tooltip title="Guardar BackUp">
              <IconButton
                onClick={RealizarBackUp}
                aria-label="Guardar BackUp"
                sx={{
                  display: { xs: 'inline-flex', md: 'none' },
                  flexShrink: 0,
                  // Mismas medidas que el conmutador de tema para que la fila cuadre.
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  border: '1px solid var(--mui-palette-divider)',
                  backgroundColor: 'var(--mui-palette-background-level1)',
                  color: 'var(--mui-palette-primary-main)',
                  transition: 'background-color 150ms ease, border-color 150ms ease',
                  '&:hover': {
                    backgroundColor: 'var(--mui-palette-background-level2)',
                    borderColor: 'var(--mui-palette-primary-main)',
                  },
                }}
              >
                <FloppyDiskIcon size={20} weight="fill" />
              </IconButton>
            </Tooltip>
            <Button
              onClick={RealizarBackUp}
              startIcon={<FloppyDiskIcon size={18} weight="fill" />}
              sx={{
                display: { xs: 'none', md: 'inline-flex' },
                flexShrink: 0,
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
              }}
            >
              Guardar BackUp
            </Button>
            <ColorSchemeToggle />
            {/* <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              // src="/assets/avatar.png"
              // src="/assets/favicon.ico"
              src="/assets/AvatarDefault.png"
              sx={{ cursor: 'pointer' }}
            /> */}
            {/*
              El esqueleto media 80x80 y el avatar real 40x40 (medida por defecto de
              MUI): al cargar la imagen la cabecera daba un salto y de paso apretaba
              al resto de controles en movil. Ahora ambos miden lo mismo.
            */}
            {cargandoAvatar ? (
              <Skeleton variant="circular" width={40} height={40} sx={{ flexShrink: 0 }} />
            ) : (
              <Avatar
                onClick={userPopover.handleOpen}
                ref={userPopover.anchorRef}
                // El avatar es el control prioritario: medida fija y sin compresion.
                sx={{ cursor: 'pointer', width: 40, height: 40, flexShrink: 0 }}
                src={avatarUrl}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/AvatarDefault.png';
                }}
              />
            )}
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