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
import { config } from '@/config';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';
import {
  EASE_IOS,
  GlassSeparator,
  NAV_CSS_VARS,
  NavBrand,
  glassIconButtonSx,
  glassSearchSx,
  navIconFill,
  navItemSx,
  nestedListSx,
} from './nav-glass';

import { CaretDown, CaretRight } from '@phosphor-icons/react/dist/ssr';

import { UserContext } from '@/contexts/user-context';

// Ancho total de la columna, incluido el margen de 8px alrededor del panel flotante.
// El expandido debe coincidir con `--SideNav-width` de dashboard/layout.tsx.
const SIDENAV_WIDTH_EXPANDED = '280px';
const SIDENAV_WIDTH_COLLAPSED = '80px';

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
    document.body.style.setProperty('--SideNav-width', collapsed ? SIDENAV_WIDTH_COLLAPSED : SIDENAV_WIDTH_EXPANDED);
  }, [collapsed]);

  React.useEffect(() => {
    if (collapsed) {
      setQuery('');
    }
  }, [collapsed]);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.body.style.setProperty('--SideNav-width', next ? SIDENAV_WIDTH_COLLAPSED : SIDENAV_WIDTH_EXPANDED);
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
    // Columna fija transparente; dentro flota el panel de vidrio con 8px de margen (estilo iPadOS)
    <Box
      sx={{
        '--SideNav-color': 'var(--mui-palette-text-primary)',
        ...NAV_CSS_VARS,
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        height: '100%',
        left: 0,
        maxWidth: '100%',
        position: 'fixed',
        top: 0,
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        p: 1,
        // Misma duración y curva que `padding-left` del contenido y el footer (dashboard/layout.tsx)
        transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <Box
        className="liquid-glass"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 auto',
          minWidth: 0,
          borderRadius: '24px',
          // `clip` y no `hidden`: recorta la luz ambiental sin volver el panel desplazable
          overflow: 'clip',
        }}
      >
      <Box className="liquid-glass__ambient" aria-hidden />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          gap: 1,
          height: 64,
          flex: '0 0 auto',
          px: collapsed ? 0 : 1.75,
        }}
      >
        {!collapsed ? <NavBrand /> : null}
        {/* A la derecha para que el tooltip no tape los ítems de navegación */}
        <Tooltip title={collapsed ? 'Expandir menú' : 'Contraer menú'} placement="right" disableInteractive>
          <IconButton
            aria-label={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
            aria-expanded={!collapsed}
            onClick={toggleSidebar}
            sx={glassIconButtonSx}
          >
            {collapsed ? <ArrowLineRight size={18} /> : <ArrowLineLeft size={18} />}
          </IconButton>
        </Tooltip>
      </Box>

      <GlassSeparator />

      <Box
        component="nav"
        sx={{ flex: '1 1 auto', p: collapsed ? 1 : 1.25, overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }}
        tabIndex={0}
      >
        {!collapsed ? (
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
        ) : null}

        {renderNavItems({ pathname, items: itemsFiltradosPorQuery, collapsed, query })}
      </Box>
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
  /** Subítem dentro de un grupo desplegado */
  nested?: boolean;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, items, collapsed, query, nested = false }: NavItemProps): React.JSX.Element {
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
          centrarEnNav(itemRef.current);
        }
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [active, collapsed]);

  React.useEffect(() => {
    if (isChildActive && !collapsed) {
       const timer = setTimeout(() => {
        if (itemRef.current) {
          centrarEnNav(itemRef.current);
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
        sx={navItemSx({ active: effectiveActive, nested, disabled, collapsed })}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto', width: 22 }}>
          {Icon ? (
            <Icon
              fill={navIconFill(effectiveActive, nested)}
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
              <Typography
                component="span"
                sx={{ color: 'inherit', fontSize: '0.875rem', fontWeight: effectiveActive ? 600 : 500, lineHeight: '28px' }}
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
        )}
      </Box>
      {hasChildren && open && !collapsed && (
        <Stack component="ul" spacing={0.25} sx={nestedListSx}>
          {items.map((subItem) => {
            const { key, ...rest } = subItem;
            return (
              <NavItem
                key={key}
                pathname={pathname}
                collapsed={collapsed}
                query={query}
                nested
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
          // Menú flotante en vidrio: aquí sí hay contenido detrás que difuminar
          PaperProps={{
            className: 'liquid-glass',
            sx: {
              ml: 2.5,
              p: 1,
              minWidth: 220,
              borderRadius: '18px',
              bgcolor: 'var(--glass-bg-strong)',
              backgroundImage: 'none',
              boxShadow: 'var(--glass-shadow)',
            },
          }}
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
                    display: 'block',
                    px: 1.5,
                    py: 1,
                    borderRadius: '10px',
                    color: 'var(--mui-palette-text-secondary)',
                    textDecoration: 'none',
                    ...(sdisabled && { opacity: 0.6, pointerEvents: 'none' }),
                    transition: `background-color 0.2s ${EASE_IOS}, color 0.2s ${EASE_IOS}, transform 0.2s ${EASE_IOS}`,
                    '&:hover': {
                      bgcolor: 'var(--glass-hover)',
                      color: 'var(--mui-palette-text-primary)',
                    },
                    '&:active': { transform: 'scale(0.97)' },
                    ...(isNavItemActive({ ...subItem, pathname }) && {
                      bgcolor: 'rgba(var(--mui-palette-primary-mainChannel) / 0.14)',
                      color: 'var(--mui-palette-primary-main)',
                      fontWeight: 600,
                    }),
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

/**
 * Centra un ítem dentro de la lista `<nav>` desplazando SOLO esa lista.
 *
 * No se usa `scrollIntoView`: desplaza todos los ancestros desplazables, y el
 * panel de vidrio lo es (su luz ambiental sobresale del borde). El panel se
 * subía y la cabecera con el logo desaparecía al marcar una opción inferior.
 */
function centrarEnNav(elemento: HTMLElement): void {
  const nav = elemento.closest('nav');
  if (!nav) return;
  const navRect = nav.getBoundingClientRect();
  const itemRect = elemento.getBoundingClientRect();
  const desplazamiento = itemRect.top - navRect.top - (nav.clientHeight - itemRect.height) / 2;
  nav.scrollTop += desplazamiento;
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
