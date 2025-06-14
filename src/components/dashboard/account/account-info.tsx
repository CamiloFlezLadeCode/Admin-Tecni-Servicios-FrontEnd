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

const userold = {
  name: 'Sofia Rivers',
  avatar: '/assets/avatar.png',
  jobTitle: 'Senior Developer',
  country: 'USA',
  city: 'Los Angeles',
  timezone: 'GTM-7',
} as const;

export function AccountInfo(): React.JSX.Element {
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
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar
              src={preview || userold.avatar}
              sx={{ height: '80px', width: '80px' }}
            />
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
      </CardActions>
    </Card>
  );
}
