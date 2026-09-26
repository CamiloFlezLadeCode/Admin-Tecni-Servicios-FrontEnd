'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
// import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
// import { ArrowsInLineHorizontal } from '@phosphor-icons/react/dist/ssr/ArrowsInLineHorizontal'
import { ArrowLineLeft } from '@phosphor-icons/react/dist/ssr/ArrowLineLeft' 
import { ArrowLineRight } from '@phosphor-icons/react/dist/ssr/ArrowLineRight'  
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';

// import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
// import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { config } from '@/config';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

import { CaretDown, CaretRight } from '@phosphor-icons/react/dist/ssr';

import { UserContext } from '@/contexts/user-context';

export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const { user } = React.useContext(UserContext) || { user: null };
  const rolUsuario = user?.rol ?? '';
  const itemsFiltrados = navItems.filter((item) => {
    return !item.roles || item.roles.includes(rolUsuario);
  });

  const [collapsed, setCollapsed] = React.useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('sidebar-collapsed');
      return stored === 'true';
    }
    return false;
  });

  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    document.body.style.setProperty('--SideNav-width', collapsed ? '72px' : '280px');
  }, [collapsed]);

  React.useEffect(() => {
    if (collapsed) {
      setQuery('');
    }
  }, [collapsed]);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.body.style.setProperty('--SideNav-width', next ? '72px' : '280px');
    window.localStorage.setItem('sidebar-collapsed', String(next));
  };

  const itemsFiltradosPorQuery = React.useMemo(() => {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) {
      return itemsFiltrados;
    }
    return filterNavItems(itemsFiltrados, normalizedQuery);
  }, [itemsFiltrados, query]);

  return (
    <Box
      sx={{
        // El sidebar se apoya en `background-paper`, igual que la barra
        // superior: juntos forman el marco de la aplicación (blanco limpio en
        // claro, pizarra profunda en oscuro) sobre el lienzo `background-default`.
        '--SideNav-background': 'var(--mui-palette-background-paper)',
        '--SideNav-color': 'var(--mui-palette-text-primary)',
        // Superficie de los elementos embebidos dentro del sidebar: buscador,
        // tarjeta inferior y avatar. Un escalón por encima del fondo.
        '--SideNav-surface': 'var(--mui-palette-background-level1)',
        '--NavItem-color': 'var(--mui-palette-text-secondary)',
        '--NavItem-hover-background': 'var(--mui-palette-action-hover)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-text-disabled)',
        '--NavItem-icon-color': 'var(--mui-palette-text-secondary)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-text-disabled)',
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
        overflow: 'hidden',
        // Misma duración y curva que `padding-left` del contenido y el footer (dashboard/layout.tsx)
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        borderRight: '1px solid var(--mui-palette-divider)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      {/*
        Cabecera con la misma altura que la barra superior (64px + 1px de
        divisor = 65px de MainNav), para que ambas líneas divisorias queden
        alineadas en los dos estados del sidebar.
      */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 1,
          height: 64,
          flex: '0 0 auto',
          px: collapsed ? 0 : 2,
        }}
      >
        {!collapsed ? (
          <Box
            component={RouterLink}
            href={paths.dashboard.overview}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              minWidth: 0,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              src="/assets/LogoCompanyLogoIco.png"
              alt=""
              sx={{ width: 32, height: 32, borderRadius: 1, objectFit: 'contain', flex: '0 0 auto' }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography noWrap variant="subtitle2" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                TECNISERVICIOS
              </Typography>
              <Typography noWrap variant="caption" sx={{ display: 'block', color: 'var(--mui-palette-text-secondary)', lineHeight: 1.2 }}>
                Panel administrativo
              </Typography>
            </Box>
          </Box>
        ) : null}
        {/* A la derecha para que el tooltip no tape los ítems de navegación */}
        <Tooltip title={collapsed ? 'Expandir menú' : 'Contraer menú'} placement="right" disableInteractive>
          <IconButton
            aria-label={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
            aria-expanded={!collapsed}
            onClick={toggleSidebar}
            sx={{
              width: 32,
              height: 32,
              flex: '0 0 auto',
              borderRadius: 1,
              color: 'var(--mui-palette-text-secondary)',
              '&:hover': {
                bgcolor: 'var(--NavItem-hover-background)',
                color: 'var(--mui-palette-text-primary)',
              },
            }}
          >
            {collapsed ? <ArrowLineRight size={18} /> : <ArrowLineLeft size={18} />}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      <Box
        component="nav"
        sx={{ flex: '1 1 auto', p: collapsed ? 1 : 1.5, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
        tabIndex={0}
      >
        {!collapsed ? (
          <Box sx={{ px: 0.5, pb: 1 }}>
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
              // Borde, foco y placeholder ya vienen del tema (MuiOutlinedInput);
              // aquí sólo se hunde el campo respecto al fondo del sidebar.
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'var(--SideNav-surface)' } }}
            />
          </Box>
        ) : null}

        {renderNavItems({ pathname, items: itemsFiltradosPorQuery, collapsed, query })}
      </Box>
    </Box>
  );
}

function renderNavItems({
  items = [],
  pathname,
  collapsed = false,
  query,
}: {
  items?: NavItemConfig[];
  pathname: string;
  collapsed?: boolean;
  query?: string;
}): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} collapsed={collapsed} query={query} {...item} />);

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
  items?: NavItemConfig[];
  collapsed?: boolean;
  query?: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, items, collapsed, query }: NavItemProps): React.JSX.Element {
  const itemRef = React.useRef<HTMLDivElement>(null);
  const isChildActive = items?.some((item) =>
    isNavItemActive({ ...item, pathname })
  );
  const [open, setOpen] = React.useState(isChildActive);
  // const [open, setOpen] = React.useState(false);
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const effectiveActive = Boolean(active || (collapsed && isChildActive));
  const Icon = icon ? navIcons[icon] : null;
  const hasChildren = items && items.length > 0;
  const [flyAnchor, setFlyAnchor] = React.useState<HTMLElement | null>(null);
  const flyOpen = Boolean(flyAnchor);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [suppressTooltip, setSuppressTooltip] = React.useState(false);

  React.useEffect(() => {
    if (isChildActive) {
      setOpen(true);
    }
  }, [isChildActive, collapsed]);

  React.useEffect(() => {
    if (query && hasChildren) {
      setOpen(true);
    }
  }, [hasChildren, query]);

  React.useEffect(() => {
    if (active && !collapsed) {
      const timer = setTimeout(() => {
        if (itemRef.current) {
          itemRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [active, collapsed]);

  React.useEffect(() => {
    if (isChildActive && !collapsed) {
       const timer = setTimeout(() => {
        if (itemRef.current) {
          itemRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [isChildActive, collapsed]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const content = (
    <div>
      <Box
        ref={itemRef}
        {...(href
          ? {
            component: external ? 'a' : RouterLink,
            href,
            target: external ? '_blank' : undefined,
            rel: external ? 'noreferrer' : undefined,
          }
          : { role: 'button' })}
        onClick={(e) => {
          if (!hasChildren) return;
          e.preventDefault();
          if (collapsed) {
            const currentTarget = e.currentTarget as HTMLElement;
            setSuppressTooltip(true);
            setTooltipOpen(false);
            setFlyAnchor((prev) => (prev ? null : currentTarget));
            return;
          }
          handleToggle();
        }}
        onMouseLeave={() => {
          if (!collapsed || !hasChildren) return;
          setTooltipOpen(false);
          setSuppressTooltip(false);
        }}
        aria-current={effectiveActive ? 'page' : undefined}
        aria-expanded={hasChildren ? (collapsed ? flyOpen : open) : undefined}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',
          flex: '0 0 auto',
          gap: 1,
          p: collapsed ? '10px' : '10px 12px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          justifyContent: collapsed ? 'center' : 'flex-start',
          transition: 'background-color 120ms ease, color 120ms ease',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(effectiveActive && {
            bgcolor: 'var(--NavItem-active-background)',
            color: 'var(--NavItem-active-color)',
            // Halo derivado del propio primario: da relieve al ítem activo
            // sin fijar una sombra negra que en modo oscuro no se vería.
            boxShadow: '0 1px 3px rgba(var(--mui-palette-primary-mainChannel) / 0.35)',
          }),
          ...(effectiveActive
            ? {}
            : {
                '&:hover': {
                  bgcolor: 'var(--NavItem-hover-background)',
                  color: 'var(--mui-palette-text-primary)',
                },
              }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto', width: 22 }}>
          {Icon ? (
            <Icon
              fill={effectiveActive ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={effectiveActive ? 'fill' : undefined}
            />
          ) : (
            <Box sx={{ width: 18, height: 18 }} />
          )}
        </Box>
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', flex: '1 1 auto', minWidth: 0 }}>
            <Box sx={{ flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <Typography component="span" sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}>
                {title}
              </Typography>
            </Box>
            {hasChildren && (
              <Box sx={{ marginLeft: 'auto' }}>
                {open ? <CaretDown /> : <CaretRight />}
              </Box>
            )}
          </Box>
        )}
      </Box>
      {hasChildren && open && !collapsed && (
        <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0, marginLeft: '14px', marginTop: 0.5 }}>
          {items.map((subItem) => {
            const { key, ...rest } = subItem;
            return (
              <NavItem
                key={key}
                pathname={pathname}
                collapsed={collapsed}
                query={query}
                {...rest}
              />
            );
          })}
        </Stack>
      )}
      {collapsed && hasChildren && (
        <Popover
          open={flyOpen}
          anchorEl={flyAnchor}
          onClose={() => {
            setFlyAnchor(null);
            setTooltipOpen(false);
            setSuppressTooltip(true);
          }}
          disableAutoFocus
          disableEnforceFocus
          disableRestoreFocus
          anchorOrigin={{ vertical: 'center', horizontal: 'right' }}
          transformOrigin={{ vertical: 'center', horizontal: 'left' }}
          // Fondo, borde, radio y sombra los aporta el tema (MuiPopover).
          PaperProps={{ sx: { ml: 2, p: 1, minWidth: 220 } }}
        >
          <Box sx={{ px: 1, py: 0.75 }}>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} variant="subtitle2">
              {title}
            </Typography>
            <Typography sx={{ color: 'var(--mui-palette-text-secondary)', lineHeight: 1.2 }} variant="caption">
              Opciones
            </Typography>
          </Box>
          <Divider sx={{ my: 0.5 }} />
          <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {items.map((subItem) => {
              const { key, title: stitle, href: shref, external: sexternal, disabled: sdisabled } = subItem;
              return (
                <Box
                  key={key}
                  component={sexternal ? 'a' : RouterLink}
                  href={shref}
                  onClick={() => {
                    setFlyAnchor(null);
                    setTooltipOpen(false);
                    setSuppressTooltip(true);
                  }}
                  // El flyout vive en un portal fuera del sidebar, así que no
                  // hereda las variables locales `--NavItem-*`: se usan tokens.
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    color: 'var(--mui-palette-text-secondary)',
                    textDecoration: 'none',
                    ...(sdisabled && { opacity: 0.6, pointerEvents: 'none' }),
                    transition: 'background-color 120ms ease, color 120ms ease',
                    '&:hover': {
                      bgcolor: 'var(--mui-palette-action-hover)',
                      color: 'var(--mui-palette-text-primary)',
                    },
                  }}
                >
                  {stitle}
                </Box>
              );
            })}
          </Stack>
        </Popover>
      )}
    </div>
  );

  return (
    <li>
      {collapsed ? (
        <Tooltip
          title={title}
          placement="right"
          disableFocusListener={hasChildren}
          disableTouchListener={hasChildren}
          disableInteractive={hasChildren}
          open={hasChildren ? (flyOpen ? false : tooltipOpen) : undefined}
          onOpen={hasChildren ? () => {
            if (!suppressTooltip) setTooltipOpen(true);
          } : undefined}
          onClose={hasChildren ? () => setTooltipOpen(false) : undefined}
          leaveDelay={0}
        >
          {content}
        </Tooltip>
      ) : (
        content
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































// 'use client';

// import * as React from 'react';
// import RouterLink from 'next/link';
// import { usePathname } from 'next/navigation';
// import Box from '@mui/material/Box';
// import IconButton from '@mui/material/IconButton';
// import Divider from '@mui/material/Divider';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { ArrowLineLeft, ArrowLineRight } from '@phosphor-icons/react/dist/ssr';
// import { CaretDown, CaretRight } from '@phosphor-icons/react/dist/ssr';

// import type { NavItemConfig } from '@/types/nav';
// import { paths } from '@/paths';
// import { isNavItemActive } from '@/lib/is-nav-item-active';
// import { Logo } from '@/components/core/logo';
// import { navItems } from './config';
// import { navIcons } from './nav-icons';
// import { UserContext } from '@/contexts/user-context';

// export function SideNav(): React.JSX.Element {
//   const pathname = usePathname();
//   const { user } = React.useContext(UserContext) || { user: null };
//   const [collapsed, setCollapsed] = React.useState(false);
//   const rolUsuario = user?.rol ?? '';
  
//   // Filtrar navItems según el rol
//   const itemsFiltrados = navItems.filter((item) => {
//     return !item.roles || item.roles.includes(rolUsuario);
//   });

//   const toggleSidebar = () => {
//     setCollapsed(!collapsed);
//   };

//   return (
//     <>
//       {/* Sidebar principal */}
//       <Box
//         sx={{
//           '--SideNav-background': 'var(--mui-palette-neutral-950)',
//           '--SideNav-color': 'var(--mui-palette-common-white)',
//           '--NavItem-color': 'var(--mui-palette-neutral-300)',
//           '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
//           '--NavItem-active-background': 'var(--mui-palette-primary-main)',
//           '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
//           '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
//           '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
//           '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
//           '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
//           '--SideNav-width': collapsed ? '72px' : '280px',
//           bgcolor: 'var(--SideNav-background)',
//           color: 'var(--SideNav-color)',
//           display: { xs: 'none', lg: 'flex' },
//           flexDirection: 'column',
//           height: '100%',
//           left: 0,
//           maxWidth: '100%',
//           position: 'fixed',
//           scrollbarWidth: 'none',
//           top: 0,
//           width: 'var(--SideNav-width)',
//           zIndex: 'var(--SideNav-zIndex)',
//           overflow: 'hidden',
//           transition: 'width 0.3s ease',
//           '&::-webkit-scrollbar': { display: 'none' },
//         }}
//       >
//         {/* Encabezado con botón de colapsar */}
//         <Stack direction="row" spacing={2} sx={{ p: 3, alignItems: 'center', justifyContent: 'space-between' }}>
//           <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex', overflow: 'hidden' }}>
//             <Logo color="light" height={112} width={222} 
//             sx={{ 
//               transition: 'opacity 0.3s ease, width 0.3s ease',
//               opacity: collapsed ? 0 : 1,
//               width: collapsed ? '0' : '222px'
//             }} 
//             />
//           </Box>
//           <IconButton
//             onClick={toggleSidebar}
//             sx={{
//               color: 'var(--mui-palette-neutral-400)',
//               '&:hover': {
//                 backgroundColor: 'rgba(255, 255, 255, 0.08)',
//               },
//               minWidth: '40px',
//               minHeight: '40px',
//               marginLeft: collapsed ? '0' : 'auto',
//             }}
//           >
//             {collapsed ? <ArrowLineRight size={20} /> : <ArrowLineLeft size={20} />}
//           </IconButton>
//         </Stack>
        
//         <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
        
//         <Box 
//           component="nav" 
//           sx={{ 
//             flex: '1 1 auto', 
//             p: '12px', 
//             overflowY: 'auto', 
//             scrollbarWidth: 'none',
//             '&::-webkit-scrollbar': { display: 'none' } 
//           }} 
//           tabIndex={0}
//         >
//           {renderNavItems({ pathname, items: itemsFiltrados, collapsed })}
//         </Box>
        
//         <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
//       </Box>
//     </>
//   );
// }

// function renderNavItems({ items = [], pathname, collapsed = false }: { items?: NavItemConfig[]; pathname: string; collapsed?: boolean }): React.JSX.Element {
//   const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
//     const { key, ...item } = curr;

//     acc.push(<NavItem key={key} pathname={pathname} collapsed={collapsed} {...item} />);

//     return acc;
//   }, []);

//   return (
//     <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
//       {children}
//     </Stack>
//   );
// }

// interface NavItemProps extends Omit<NavItemConfig, 'items'> {
//   pathname: string;
//   items?: NavItemConfig[];
//   collapsed?: boolean;
// }

// function NavItem({ disabled, external, href, icon, matcher, pathname, title, items, collapsed }: NavItemProps): React.JSX.Element {
//   const isChildActive = items?.some((item) => isNavItemActive({ ...item, pathname }));
//   const [open, setOpen] = React.useState(isChildActive);
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
//             component: external ? 'a' : RouterLink,
//             href,
//             target: external ? '_blank' : undefined,
//             rel: external ? 'noreferrer' : undefined,
//           }
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
//           ...(active ? {} : {
//             '&:hover': {
//               bgcolor: 'var(--NavItem-hover-background)',
//               color: 'var(--NavItem-hover-color)',
//             },
//           }),
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
        
//         {!collapsed && (
//           <>
//             <Box sx={{ flex: '1 1 auto', overflow: 'hidden', textOverflow: 'ellipsis' }}>
//               <Typography
//                 component="span"
//                 sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: 500, lineHeight: '28px' }}
//               >
//                 {title}
//               </Typography>
//             </Box>
//             {hasChildren && (
//               <Box sx={{ marginLeft: 'auto' }}>
//                 {open ? <CaretDown /> : <CaretRight />}
//               </Box>
//             )}
//           </>
//         )}
//       </Box>
      
//       {hasChildren && open && !collapsed && (
//         <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0, marginLeft: '20px' }}>
//           {items.map((subItem) => {
//             const { key, ...rest } = subItem;
//             return (
//               <NavItem
//                 key={key}
//                 pathname={pathname}
//                 collapsed={collapsed}
//                 {...rest}
//               />
//             );
//           })}
//         </Stack>
//       )}
//     </li>
//   );
// }
