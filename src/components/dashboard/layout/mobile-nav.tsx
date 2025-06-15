'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'; // o usa tu icono preferido
import { CaretRight, CaretDown } from '@phosphor-icons/react/dist/ssr';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import { UserContext } from '@/contexts/user-context';



export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

export function MobileNav({ open, onClose }: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();
  // Se captura el rol del usuario activo para ocultar ó mostrar la columna de acciones
  const { user } = React.useContext(UserContext) || { user: null };
  const MostrarConfiguracionesDeAltoNivel = user?.rol === 'Administrador';
  const rolUsuario = user?.rol ?? '';
  // Filtrar navItems según el rol
  const itemsFiltrados = navItems.filter((item) => {
    return !item.roles || item.roles.includes(rolUsuario);
  });
  // ...
  return (
    <Drawer
      PaperProps={{
        sx: {
          '--MobileNav-background': 'var(--mui-palette-neutral-950)',
          '--MobileNav-color': 'var(--mui-palette-common-white)',
          '--NavItem-color': 'var(--mui-palette-neutral-300)',
          '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
          '--NavItem-active-background': 'var(--mui-palette-primary-main)',
          '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
          '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
          '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
          '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
          bgcolor: 'var(--MobileNav-background)',
          color: 'var(--MobileNav-color)',
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '100%',
          scrollbarWidth: 'none',
          width: 'var(--MobileNav-width)',
          zIndex: 'var(--MobileNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex', margin: '0 auto' }}>
          <Logo color="light" height={102} width={202} />
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
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        {/* {renderNavItems({ pathname, items: navItems })} */}
        {renderNavItems({ pathname, items: itemsFiltrados })}
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
    </Drawer>
  );
}

// function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
//   const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
//     const { key, ...item } = curr;

//     acc.push(<NavItem key={key} pathname={pathname} {...item} />);

//     return acc;
//   }, []);

//   return (
//     <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
//       {children}
//     </Stack>
//   );
// }

// function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
//   const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
//     const { key, items: subItems, ...item } = curr;

//     acc.push(
//       <React.Fragment key={key}>
//         <NavItem key={key} pathname={pathname} {...item} />
//         {subItems && subItems.length > 0 ? (
//           <Box component="ul" sx={{ listStyle: 'none', pl: 3 }}>
//             {renderNavItems({ items: subItems, pathname })}
//           </Box>
//         ) : null}
//       </React.Fragment>
//     );

//     return acc;
//   }, []);

//   return (
//     <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
//       {children}
//     </Stack>
//   );
// }


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


// interface NavItemProps extends Omit<NavItemConfig, 'items'> {
//   pathname: string;
// }

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



interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
  items?: NavItemConfig[]; // Asegúrate de incluir esto
}

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
