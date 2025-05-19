'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
// import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

import { CaretDown, CaretRight } from '@phosphor-icons/react/dist/ssr';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        scrollbarWidth: 'none',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          {/* <Logo color="light" height={32} width={122} /> */}
          <Logo color="light" height={112} width={222} />
        </Box>
        {/* <Box
          sx={{
            alignItems: 'center',
            backgroundColor: 'var(--mui-palette-neutral-950)',
            border: '1px solid var(--mui-palette-neutral-700)',
            borderRadius: '12px',
            cursor: 'pointer',
            display: 'flex',
            p: '4px 12px',
          }}
        >
          <Box sx={{ flex: '1 1 auto' }}>
            <Typography color="var(--mui-palette-neutral-400)" variant="body2">
              Workspace
            </Typography>
            <Typography color="inherit" variant="subtitle1">
              Devias
            </Typography>
          </Box>
          <CaretUpDownIcon />
        </Box> */}
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px', overflowY: 'scroll', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }} tabIndex={0}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      {/* <Stack spacing={2} sx={{ p: '12px' }}>
        <div>
          <Typography color="var(--mui-palette-neutral-100)" variant="subtitle2">
            Need more features?
          </Typography>
          <Typography color="var(--mui-palette-neutral-400)" variant="body2">
            Check out our Pro solution template.
          </Typography>
        </div>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            alt="Pro version"
            src="/assets/devias-kit-pro.png"
            sx={{ height: 'auto', width: '160px' }}
          />
        </Box>
        <Button
          component="a"
          endIcon={<ArrowSquareUpRightIcon fontSize="var(--icon-fontSize-md)" />}
          fullWidth
          href="https://material-kit-pro-react.devias.io/"
          sx={{ mt: 2 }}
          target="_blank"
          variant="contained"
        >
          Pro version
        </Button>
      </Stack> */}
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  items?: NavItemConfig[]; // Asegúrate de incluir esto
}

// BUENA IMPLEMENTACIÓN
// function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
//   const active = isNavItemActive({ disabled, external, href, matcher, pathname });
//   const Icon = icon ? navIcons[icon] : null;

//   return (
//     <li>
//       <Box
//         {...(href
//           ? {
//               component: external ? 'a' : RouterLink,
//               href,
//               target: external ? '_blank' : undefined,
//               rel: external ? 'noreferrer' : undefined,
//             }
//           : { role: 'button' })}
//         sx={{
//           alignItems: 'center',
//           borderRadius: 1,
//           color: 'var(--NavItem-color)',
//           cursor: 'pointer',
//           display: 'flex',
//           flex: '0 0 auto',
//           gap: 1,
//           p: '6px 16px',
//           position: 'relative',
//           textDecoration: 'none',
//           whiteSpace: 'nowrap',
//           ...(disabled && {
//             bgcolor: 'var(--NavItem-disabled-background)',
//             color: 'var(--NavItem-disabled-color)',
//             cursor: 'not-allowed',
//           }),
//           ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
//         }}
//       >
//         <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
//           {Icon ? (
//             <Icon
//               fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
//               fontSize="var(--icon-fontSize-md)"
//               weight={active ? 'fill' : undefined}
//             />
//           ) : null}
//         </Box>
//         <Box sx={{ flex: '1 1 auto' }}>
//           <Typography
//             component="span"
//             sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
//           >
//             {title}
//           </Typography>
//         </Box>
//       </Box>
//     </li>
//   );
// }
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// function NavItem({ disabled, external, href, icon, matcher, pathname, title, items }: NavItemProps): React.JSX.Element {
//   const [open, setOpen] = React.useState(false); // Estado para controlar la visibilidad de subopciones
//   const active = isNavItemActive({ disabled, external, href, matcher, pathname }); // Verifica si la opción padre es activa
//   const Icon = icon ? navIcons[icon] : null;
//   const hasChildren = items && items.length > 0;

//   const handleToggle = () => {
//     setOpen((prev) => !prev); // Cambia el estado de visibilidad
//   };

//   return (
//     <li>
//       <Box
//         {...(href
//           ? {
//             component: external ? 'a' : RouterLink,
//             href,
//             target: external ? '_blank' : undefined,
//             rel: external ? 'noreferrer' : undefined,
//           }
//           : { role: 'button' })}
//         onClick={handleToggle} // Maneja el clic para mostrar/ocultar subopciones
//         sx={{
//           alignItems: 'center',
//           borderRadius: 1,
//           color: 'var(--NavItem-color)',
//           cursor: 'pointer',
//           display: 'flex',
//           flex: '0 0 auto',
//           gap: 1,
//           p: '6px 16px',
//           position: 'relative',
//           textDecoration: 'none',
//           whiteSpace: 'nowrap',
//           ...(disabled && {
//             bgcolor: 'var(--NavItem-disabled-background)',
//             color: 'var(--NavItem-disabled-color)',
//             cursor: 'not-allowed',
//           }),
//           ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
//         }}
//       >
//         <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
//           {Icon ? (
//             <Icon
//               fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
//               fontSize="var(--icon-fontSize-md)"
//               weight={active ? 'fill' : undefined}
//             />
//           ) : null}
//         </Box>
//         <Box sx={{ flex: '1 1 auto' }}>
//           <Typography
//             component="span"
//             sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
//           >
//             {title}
//           </Typography>
//         </Box>
//         {hasChildren && (
//           <Box sx={{ marginLeft: 'auto' }}>
//             {open ? <CaretDown /> : <CaretRight />}
//           </Box>
//         )}
//       </Box>
//       {hasChildren && open && ( // Solo muestra las subopciones si 'open' es verdadero
//         <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0, marginLeft: '20px' }}>
//           {/* {items.map((subItem) => (
//             <NavItem 
//               key={subItem.key} 
//               pathname={pathname} // Pasa el pathname actual
//               {...subItem} 
//             />
//           ))} */}

//           {items.map((subItem) => {
//             const { key, ...rest } = subItem; // Desestructurando para quitar 'key'
//             return (
//               <NavItem
//                 key={key} // Asignando 'key' directamente
//                 pathname={pathname} // Pasa el pathname actual
//                 {...rest} // Pasando el resto de las propiedades
//               />
//             );
//           })}
//         </Stack>
//       )}
//     </li>
//   );
// }


// CASI COMPLETO
// function NavItem({ disabled, external, href, icon, matcher, pathname, title, items }: NavItemProps): React.JSX.Element {
//   const [open, setOpen] = React.useState(false);
//   const active = isNavItemActive({ disabled, external, href, matcher, pathname });
//   const Icon = icon ? navIcons[icon] : null;
//   const hasChildren = items && items.length > 0;

//   const handleToggle = () => {
//     setOpen((prev) => !prev);
//   };

//   return (
//     <li>
//       <Box
//         {...(href
//           ? {
//               component: external ? 'a' : RouterLink,
//               href,
//               target: external ? '_blank' : undefined,
//               rel: external ? 'noreferrer' : undefined,
//             }
//           : { role: 'button' })}
//         onClick={handleToggle}
//         sx={{
//           alignItems: 'center',
//           borderRadius: 1,
//           color: 'var(--NavItem-color)',
//           cursor: 'pointer',
//           display: 'flex',
//           flex: '0 0 auto',
//           gap: 1,
//           p: '6px 16px',
//           position: 'relative',
//           textDecoration: 'none',
//           whiteSpace: 'nowrap',
//           ...(disabled && {
//             bgcolor: 'var(--NavItem-disabled-background)',
//             color: 'var(--NavItem-disabled-color)',
//             cursor: 'not-allowed',
//           }),
//           ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
//           '&:hover': {
//             bgcolor: 'var(--NavItem-hover-background)',
//             color: 'var(--NavItem-hover-color)',
//           },
//         }}
//       >
//         <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
//           {Icon ? (
//             <Icon
//               fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
//               fontSize="var(--icon-fontSize-md)"
//               weight={active ? 'fill' : undefined}
//             />
//           ) : null}
//         </Box>
//         <Box sx={{ flex: '1 1 auto' }}>
//           <Typography
//             component="span"
//             sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
//           >
//             {title}
//           </Typography>
//         </Box>
//         {hasChildren && (
//           <Box sx={{ marginLeft: 'auto' }}>
//             {open ? <CaretDown /> : <CaretRight />}
//           </Box>
//         )}
//       </Box>
//       {hasChildren && open && (
//         <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0, marginLeft: '20px' }}>
//           {items.map((subItem) => {
//             const { key, ...rest } = subItem;
//             return (
//               <NavItem
//                 key={key}
//                 pathname={pathname}
//                 {...rest}
//               />
//             );
//           })}
//         </Stack>
//       )}
//     </li>
//   );
// }



function NavItem({ disabled, external, href, icon, matcher, pathname, title, items }: NavItemProps): React.JSX.Element {
  const isChildActive = items?.some((item) =>
    isNavItemActive({ ...item, pathname })
  );
  const [open, setOpen] = React.useState(isChildActive);
  // const [open, setOpen] = React.useState(false);
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const hasChildren = items && items.length > 0;

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  return (
    <li>
      <Box
        {...(href
          ? {
            component: external ? 'a' : RouterLink,
            href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noreferrer' : undefined,
          }
          : { role: 'button' })}
        onClick={handleToggle}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(active && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
          // Estilos de hover solo si no está activo
          ...(active ? {} : {
            '&:hover': {
              bgcolor: 'var(--NavItem-hover-background)',
              color: 'var(--NavItem-hover-color)',
            },
          }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
          >
            {title}
          </Typography>
        </Box>
        {hasChildren && (
          <Box sx={{ marginLeft: 'auto' }}>
            {open ? <CaretDown /> : <CaretRight />}
          </Box>
        )}
      </Box>
      {hasChildren && open && (
        <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0, marginLeft: '20px' }}>
          {items.map((subItem) => {
            const { key, ...rest } = subItem;
            return (
              <NavItem
                key={key}
                pathname={pathname}
                {...rest}
              />
            );
          })}
        </Stack>
      )}
    </li>
  );
}
