'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { config } from '@/config';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';
import {
  GlassSeparator,
  NAV_CSS_VARS,
  NavBrand,
  glassIconButtonSx,
  glassSearchSx,
  navIconFill,
  navItemSx,
  nestedListSx,
} from './nav-glass';
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
  const [query, setQuery] = React.useState('');

  const itemsFiltradosPorQuery = React.useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) {
      return itemsFiltrados;
    }
    return filterNavItems(itemsFiltrados, normalizedQuery);
  }, [itemsFiltrados, query]);

  return (
    <Drawer
      // Velo más ligero que el de MUI: el vidrio difumina la página que queda detrás
      slotProps={{ backdrop: { sx: { bgcolor: 'rgba(2 6 23 / 0.35)' } } }}
      PaperProps={{
        // Panel de vidrio flotante a 8px de los bordes, igual que el sidebar de escritorio
        className: 'liquid-glass',
        sx: {
          ...NAV_CSS_VARS,
          color: 'var(--mui-palette-text-primary)',
          display: 'flex',
          flexDirection: 'column',
          m: 1,
          height: 'calc(100% - 16px)',
          width: 'var(--MobileNav-width)',
          maxWidth: 'calc(100% - 16px)',
          borderRadius: '24px',
          background: 'var(--glass-bg-strong)',
          backgroundImage: 'none',
          boxShadow: 'var(--glass-shadow)',
          // `clip` y no `auto`/`hidden`: recorta la luz ambiental sin volver el panel desplazable
          overflow: 'clip',
          zIndex: 'var(--MobileNav-zIndex)',
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Box className="liquid-glass__ambient" aria-hidden />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          height: 64,
          flex: '0 0 auto',
          px: 1.75,
        }}
      >
        <NavBrand onClick={onClose} />
        <IconButton aria-label="Cerrar menú" onClick={onClose} sx={glassIconButtonSx}>
          <XIcon size={18} />
        </IconButton>
      </Box>

      <GlassSeparator />

      <Box
        component="nav"
        sx={{ flex: '1 1 auto', p: 1.25, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
      >
        <Box sx={{ px: 0.25, pt: 0.5, pb: 1.25 }}>
          <TextField
            fullWidth
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            placeholder="Buscar..."
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MagnifyingGlassIcon size={18} color="var(--mui-palette-text-secondary)" />
                </InputAdornment>
              ),
            }}
            sx={glassSearchSx}
          />
        </Box>
        {renderNavItems({ pathname, items: itemsFiltradosPorQuery, onClose, query })}
      </Box>
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


function renderNavItems({
  items = [],
  pathname,
  onClose,
  query,
}: {
  items?: NavItemConfig[];
  pathname: string;
  onClose?: () => void;
  query?: string;
}): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} onClose={onClose} query={query} {...item} />);

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
  onClose?: () => void;
  query?: string;
  /** Subítem dentro de un grupo desplegado */
  nested?: boolean;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, items, onClose, query, nested = false }: NavItemProps): React.JSX.Element {

  const isChildActive = items?.some((item) =>
    isNavItemActive({ ...item, pathname })
  );
  const [open, setOpen] = React.useState(isChildActive);
  // const [open, setOpen] = React.useState(false);
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const hasChildren = items && items.length > 0;

  React.useEffect(() => {
    if (query && hasChildren) {
      setOpen(true);
    }
  }, [hasChildren, query]);

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
        onClick={
          hasChildren
            ? handleToggle
            : () => {
              onClose?.();
            }
        }
        aria-current={active ? 'page' : undefined}
        aria-expanded={hasChildren ? open : undefined}
        sx={navItemSx({ active, nested, disabled })}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto', width: 22 }}>
          {Icon ? (
            <Icon
              fill={navIconFill(active, nested)}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : (
            <Box sx={{ width: 18, height: 18 }} />
          )}
        </Box>
        <Box sx={{ flex: '1 1 auto', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <Typography
            component="span"
            sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: active ? 600 : 500, lineHeight: '28px' }}
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
        <Stack component="ul" spacing={0.25} sx={nestedListSx}>
          {items.map((subItem) => {
            const { key, ...rest } = subItem;
            return (
              <NavItem
                key={key}
                pathname={pathname}
                onClose={onClose}
                query={query}
                nested
                {...rest}
              />
            );
          })}
        </Stack>
      )}
    </li>
  );
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function filterNavItems(items: NavItemConfig[], normalizedQuery: string): NavItemConfig[] {
  return items
    .map((item) => {
      const title = item.title ?? '';
      const normalizedTitle = normalizeText(title);
      const children = item.items ? filterNavItems(item.items, normalizedQuery) : undefined;
      const matchesSelf = normalizedTitle.includes(normalizedQuery);
      const matchesChildren = Boolean(children && children.length);

      if (!matchesSelf && !matchesChildren) {
        return null;
      }

      if (children) {
        return { ...item, items: children };
      }

      return item;
    })
    .filter(Boolean) as NavItemConfig[];
}
