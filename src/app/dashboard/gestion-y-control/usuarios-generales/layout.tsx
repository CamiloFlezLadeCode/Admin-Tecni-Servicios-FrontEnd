import * as React from 'react';
import Typography from '@mui/material/Typography';
import { NavBarUsuariosGenerales } from '@/components/dashboard/gestion-y-control/usuarios-generales/NavBarUsuariosGenerales';
import { UserContext } from '@/contexts/user-context'; // Asegúrate de que la ruta sea correcta


interface LayoutProps {
    children: React.ReactNode;
}

interface Credencial {
    DocumentoUsuario: string;
    ClaveUsuario: string;
}

interface Respuesta {
    credenciales: Credencial[];
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <div>
            <Typography variant="h6" style={{fontWeight: 'bold'}}>Usuarios generales</Typography>
            <NavBarUsuariosGenerales />
            {/* <main style={{ padding: '1rem' }}>{children}</main> */}
            <main style={{ marginTop: '0.5rem' }}>{children}</main>
        </div>
    );
}