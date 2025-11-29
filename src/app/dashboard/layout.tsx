// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Container from '@mui/material/Container';
// import GlobalStyles from '@mui/material/GlobalStyles';
// import { Typography } from '@mui/material';

// import { AuthGuard } from '@/components/auth/auth-guard';
// import { MainNav } from '@/components/dashboard/layout/main-nav';
// import { SideNav } from '@/components/dashboard/layout/side-nav';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// export default function Layout({ children }: LayoutProps): React.JSX.Element {
//   return (
//     <AuthGuard>
//       <GlobalStyles
//         styles={{
//           body: {
//             '--MainNav-height': '56px',
//             '--MainNav-zIndex': 1000,
//             '--SideNav-width': '280px',
//             '--SideNav-zIndex': 1100,
//             '--MobileNav-width': '320px',
//             '--MobileNav-zIndex': 1100,
//           },
//         }}
//       />
//       <Box
//         sx={{
//           bgcolor: 'var(--mui-palette-background-default)',
//           display: 'flex',
//           flexDirection: 'column',
//           position: 'relative',
//           minHeight: '100%',
//         }}
//       >
//         <SideNav />
//         <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', pl: { lg: 'var(--SideNav-width)' } }}>
//           <MainNav />
//           <main>
//             {/* <Container maxWidth="xl" sx={{ py: '64px' }}>
//               {children}
//             </Container> */}
//             <Container maxWidth="xl" sx={{ py: '14px' }}>
//               {children}
//             </Container>
//           </main>
//         </Box>
//       </Box>
//       <Box
//         sx={{
//           position: 'fixed',
//           bottom: 0,
//           left: 0,
//           width: '100%',
//           textAlign: 'center',
//           zIndex: 999,
//           backgroundColor: 'white', // o el fondo que necesites
//           borderTop: '1px solid #ccc',
//           py: 1,
//         }}
//       >
//         <Typography variant='subtitle2'>
//           © {new Date().getFullYear()} <strong>FlezLade Softworks</strong>. Todos los derechos reservados.
//         </Typography>
//       </Box>
//     </AuthGuard>
//   );
// }



'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import GlobalStyles from '@mui/material/GlobalStyles';
import { Typography } from '@mui/material';

import { AuthGuard } from '@/components/auth/auth-guard';
import { MainNav } from '@/components/dashboard/layout/main-nav';
import { SideNav } from '@/components/dashboard/layout/side-nav';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  const VisitarPaginaCasaDesarrolladora = () => {
    window.open('https://camiloflezlade.vercel.app/', '_blank', 'noopener,noreferrer');
  }
  return (
    <AuthGuard>
      <GlobalStyles
        styles={{
          body: {
            '--MainNav-height': '56px',
            '--MainNav-zIndex': 1000,
            '--SideNav-width': '280px',
            '--SideNav-zIndex': 1100,
            '--MobileNav-width': '320px',
            '--MobileNav-zIndex': 1100,
            '--Footer-height': '60px', // Añadimos variable para el footer
          },
        }}
      />
      <Box
        sx={{
          bgcolor: 'var(--mui-palette-background-default)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          position: 'relative',
        }}
      >
        <SideNav />
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            pl: { lg: 'var(--SideNav-width)' },
            transition: 'padding-left 0.45s ease-in-out',
            minHeight: 'calc(100vh - var(--Footer-height))',
          }}
        >
          <MainNav />
          <main style={{ flex: 1, marginBottom: 20 }}>
            <Container maxWidth="xl" sx={{ py: '14px', minHeight: 'calc(100vh - var(--MainNav-height) - var(--Footer-height) - 28px)' }}>
              {children}
            </Container>
          </main>
        </Box>
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: { lg: 'var(--SideNav-width)' },
          width: { lg: `calc(100% - var(--SideNav-width))`, xs: '100%' },
          transition: 'left 0.45s ease-in-out, width 0.45s ease-in-out',
          textAlign: 'center',
          zIndex: 999,
          backgroundColor: 'white',
          borderTop: '1px solid #ccc',          
          // height: 'var(--Footer-height)',
        }}
      >
        <Typography variant='subtitle2'>
          © {new Date().getFullYear()} <strong style={{cursor: 'pointer'}} onClick={VisitarPaginaCasaDesarrolladora}>FlezLade Softworks</strong>. Todos los derechos reservados.
        </Typography>
      </Box>
    </AuthGuard>
  );
}