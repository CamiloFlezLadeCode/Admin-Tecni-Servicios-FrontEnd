// 'use client';

// import * as React from 'react';
// import Avatar from '@mui/material/Avatar';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import CardActions from '@mui/material/CardActions';
// import CardContent from '@mui/material/CardContent';
// import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { UserContext } from '@/contexts/user-context';


// const userold = {
//   name: 'Sofia Rivers',
//   avatar: '/assets/avatar.png',
//   jobTitle: 'Senior Developer',
//   country: 'USA',
//   city: 'Los Angeles',
//   timezone: 'GTM-7',
// } as const;

// export function AccountInfo(): React.JSX.Element {
//   // Consumir el contexto del usuario
//   const { user } = React.useContext(UserContext) || { user: null };
//   // Obtener el nombre del usuario, si existe
//   const nombreUsuarioActivo = user ? `${user.fullName}` : null;
//   // ...
//   // Funcionalidad para cargar imagen
//   // const [image, setImage] = React.useState<File | null>(null);
//   // const [preview, setPreview] = React.useState<string | null>(null);

//   // const HandleCargarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   const file = e.target.files[0];
//   //   if (file) {
//   //     setImage(file);
//   //     const reader = new FileReader();
//   //     reader.onloadend = () => {
//   //       setPreview(reader.result);
//   //     };
//   //     reader.readAsDataURL(file);
//   //   } else {
//   //     setImage(null);
//   //     setPreview(null);
//   //   }
//   // };


//   // Casii
//   const [image, setImage] = React.useState<File | null>(null);
//   const [preview, setPreview] = React.useState<string | null>(null);

//   const HandleCargarImagen = async (e: ) => {
//     if (!e.target.files || e.target.files.length === 0) {
//       setImage(null);
//       setPreview(null);
//       return;
//     }

//     const file = e.target.files[0];
//     setImage(file);

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const result = reader.result;
//       if (typeof result === 'string') {
//         setPreview(result);
//       }
//     };
//     reader.readAsDataURL(file);
//   };
//   // ...
//   return (
//     <Card>
//       <CardContent>
//         <Stack spacing={2} sx={{ alignItems: 'center' }}>
//           <div>
//             <Avatar src={userold.avatar} sx={{ height: '80px', width: '80px' }} />
//           </div>
//           <Stack spacing={1} sx={{ textAlign: 'center' }}>
//             <Typography variant="h5">{nombreUsuarioActivo}</Typography>
//             <Typography color="text.secondary" variant="body2">
//               {userold.city} {userold.country}
//             </Typography>
//             <Typography color="text.secondary" variant="body2">
//               {userold.timezone}
//             </Typography>
//           </Stack>
//         </Stack>
//       </CardContent>
//       <Divider />
//       <CardActions>
//         <Button fullWidth variant="text" onClick={HandleCargarImagen}>
//           Cargar imagen
//         </Button>
//       </CardActions>
//     </Card>
//   );
// }



'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { UserContext } from '@/contexts/user-context';
import { ConsultarInformacionUsuarioActivo } from '@/services/gestionycontrol/cuenta/ConsultarInformacionUsuarioActivoService';
import { GuardarAvatar } from '@/services/gestionycontrol/cuenta/SubirGuardarAvatarService';
import MensajeAlerta from '@/components/dashboard/componentes_generales/alertas/errorandsuccess';
import { MostrarAvatar } from '@/services/gestionycontrol/cuenta/MostrarAvatarService';
import Skeleton from '@mui/material/Skeleton';
import { useSocketIO } from '@/hooks/use-WebSocket';

const userold = {
  name: 'Sofia Rivers',
  // avatar: '/assets/avatar.png',
  // avatar: '/assets/AvatarDefault.png',
  // avatar: 'http://localhost:3000/uploads/avatar/1749949581825-WhatsApp%20Image%202024-11-11%20at%204.21.05%20PM%20(1).jpeg',
  avatar: 'http://localhost:3000/uploads/avatar/Meli.jpeg',
  jobTitle: 'Senior Developer',
  country: 'USA',
  city: 'Los Angeles',
  timezone: 'GTM-7',
} as const;

export function AccountInfo(): React.JSX.Element {
  //Se implementa el uso del websocket
  const { sendMessage, messages } = useSocketIO();
  // ...
  const { user } = React.useContext(UserContext) || { user: null };
  const nombreUsuarioActivo = user ? `${user.fullName}` : null;
  const DocumentoUsuarioActivo = user ? `${user.documento}` : '';

  const [image, setImage] = React.useState<File | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const HandleCargarImagen = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setImage(null);
      setPreview(null);
      return;
    }

    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === 'string') {
        setPreview(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  // Se maneja el estado para la información del usuario
  const [informacionUsuarioActivo, setinformacionUsuarioActivo] = React.useState({
    Nombres: '',
    Apellidos: '',
    Correo: '',
    Direccion: '',
    Telefono: '',
    Celular: '',
  });
  const CargarInformacionDelUsuarioActivo = async () => {
    try {
      const Info = await ConsultarInformacionUsuarioActivo(DocumentoUsuarioActivo);
      setinformacionUsuarioActivo({
        Nombres: Info[0].Nombres,
        Apellidos: Info[0].Apellidos,
        Correo: Info[0].Correo,
        Direccion: Info[0].Direccion,
        Telefono: Info[0].Telefono,
        Celular: Info[0].Celular,
      });
    } catch (error) {
      console.error(`Error al cargar la información del usuario activo: ${error}`);
    }
  };
  React.useEffect(() => {
    CargarInformacionDelUsuarioActivo();
  }, []);
  // ...

  //Para el manejo de las notificiones/alertas
  const [mostrarAlertas, setMostrarAlertas] = React.useState(false);
  const [mensajeAlerta, setMensajeAlerta] = React.useState('');
  const [tipoAlerta, setTipoAlerta] = React.useState<'success' | 'error' | 'warning'>('success');
  const mostrarMensaje = (mensaje: string, tipo: 'success' | 'error' | 'warning') => {
    setMensajeAlerta(mensaje);
    setTipoAlerta(tipo);
    setMostrarAlertas(true);
  };
  //...

  // Para enviar el avatar al servidor
  // const SubirImagenAlServidor = async () => {
  //   if (!image) return;

  //   const formData = new FormData();
  //   formData.append('imagen', image);
  //   formData.append('nombreAvatar', DocumentoUsuarioActivo);
  //   try {
  //     const response = await GuardarAvatar(formData);
  //     if (response) {
  //       mostrarMensaje('Avatar guardado correctamente', 'success');
  //     }
  //     // Actualizar preview con la ruta final (opcional)
  //     // setPreview(`http://localhost:3000${response.ruta}`);

  //   } catch (error) {
  //     console.error('Error al subir la imagen:', error);
  //     mostrarMensaje('Error al guardar el avatar', 'error');
  //   }
  // };




  const SubirImagenAlServidor = async () => {
    if (!image) {
      mostrarMensaje('Primero debes seleccionar una imagen', 'warning');
      return;
    }

    const extension = image.name.split('.').pop(); // extraer extensión original
    const nombreFinal = `${DocumentoUsuarioActivo}.${extension}`; // e.g., "123456789.png"

    const formData = new FormData();
    formData.append('imagen', image);

    try {
      const response = await GuardarAvatar(formData, nombreFinal);
      if (response) {
        mostrarMensaje('Avatar guardado correctamente', 'success');
        sendMessage('avatar-guardado', {});
        setImage(null);
        // setPreview(`http://localhost:3000${response.ruta}`); // opcional
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      mostrarMensaje('Error al guardar el avatar', 'error');
    }
  };
  // ...

  // const [avatarUrl, setAvatarUrl] = React.useState<string>('/assets/AvatarDefault.png');

  // React.useEffect(() => {
  //   const cargarAvatar = async () => {
  //     if (!DocumentoUsuarioActivo) return;

  //     const url = await MostrarAvatar(DocumentoUsuarioActivo);
  //     setAvatarUrl(url);
  //   };

  //   cargarAvatar();
  // }, [DocumentoUsuarioActivo]);

  // const [avatarUrl, setAvatarUrl] = React.useState('/assets/AvatarDefault.png');
  // const [avatarUrl, setAvatarUrl] = React.useState('');

  // React.useEffect(() => {
  //   const cargarAvatar = async () => {
  //     if (DocumentoUsuarioActivo) {
  //       const url = await MostrarAvatar(DocumentoUsuarioActivo);
  //       setAvatarUrl(url);
  //     }
  //   };
  //   cargarAvatar();
  // }, [DocumentoUsuarioActivo]);

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

  React.useEffect(() => {
    if (messages.length > 0) {
      const ultimomensajes = messages[messages.length - 1];
      if (ultimomensajes.tipo === 'avatar-guardado') {
        CargarAvatar();
      }

      if (ultimomensajes.tipo === 'informacion-usuario-activo-actualizada') {
        CargarInformacionDelUsuarioActivo();
      }
    }
  }, [messages]);

  return (
    <>
      <MensajeAlerta
        open={mostrarAlertas}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
        onClose={() => setMostrarAlertas(false)}
      />
      <Card>
        <CardContent>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <div>
              {/* <Avatar
                src={preview || userold.avatar}
                sx={{ height: '80px', width: '80px' }}
              /> */}
              {/* <Avatar
                src={preview || avatarUrl}
                sx={{ height: '80px', width: '80px' }}
              /> */}
              {/* <Avatar
                src={preview || avatarUrl}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = '/assets/AvatarDefault.png';
                }}
                sx={{ height: '80px', width: '80px' }}
              /> */}

              {cargandoAvatar ? (
                <Skeleton variant="circular" width={80} height={80} />
              ) : (
                <Avatar
                  // src={avatarUrl}
                  src={preview || avatarUrl}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = '/assets/AvatarDefault.png';
                  }}
                  sx={{ height: '80px', width: '80px' }}
                />
              )}


            </div>
            <Stack spacing={0} sx={{ textAlign: 'center' }}>
              <Typography variant="h5">{nombreUsuarioActivo}</Typography>
              <Typography color="text.secondary" variant="body2">
                {/* {userold.city} {userold.country} <br /> */}
                {informacionUsuarioActivo.Direccion}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {informacionUsuarioActivo.Correo}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {informacionUsuarioActivo.Celular}
              </Typography>
              {/* <Typography color="text.secondary" variant="body2">
              {userold.timezone}
            </Typography> */}
            </Stack>
          </Stack>
        </CardContent>
        <Divider />
        <CardActions>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={HandleCargarImagen}
          />

          <Button fullWidth variant="text" onClick={handleClick}>
            Subir imagen
          </Button>
          <Button fullWidth variant="contained" onClick={SubirImagenAlServidor} >
            Guardar imagen
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
