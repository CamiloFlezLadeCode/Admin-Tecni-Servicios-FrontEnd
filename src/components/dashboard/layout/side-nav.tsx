'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
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

  const userDisplayName =
    user?.name ?? (user as unknown as { fullName?: string } | null)?.fullName ?? user?.email ?? 'Usuario';
  const userSecondaryText = user?.rol ?? user?.documento ?? '';

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
        overflow: 'hidden',
        transition: 'width 0.45s ease-in-out',
        borderRight: '1px solid var(--mui-palette-neutral-800)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: collapsed ? 1 : 2,
          py: collapsed ? 1 : 2,
        }}
      >
        <Box
          component={RouterLink}
          href={paths.home}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            minWidth: 0,
            flex: '1 1 auto',
            textDecoration: 'none',
          }}
        >
          {/* <Logo color="light" emblem={collapsed} height={44} width={collapsed ? 44 : 44} /> */}
          {/* {!collapsed ? (
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, lineHeight: 1.2, color: 'var(--SideNav-color)' }} variant="subtitle1">
                {config.site.name}
              </Typography>
              <Typography sx={{ color: 'var(--mui-palette-neutral-400)', lineHeight: 1.2 }} variant="caption">
                Panel administrativo
              </Typography>
            </Box>
          ) : null} */}
        </Box>
        <Tooltip title={collapsed ? 'Expandir' : 'Contraer'} placement="bottom">
          <IconButton
            aria-label={collapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
            onClick={toggleSidebar}
            sx={{
              color: 'var(--mui-palette-neutral-200)',
              backgroundColor: 'var(--mui-palette-neutral-900)',
              border: '1px solid var(--mui-palette-neutral-700)',
              '&:hover': { backgroundColor: 'var(--mui-palette-neutral-800)' },
              width: 36,
              height: 36,
              flex: '0 0 auto',
            }}
          >
            {collapsed ? <ArrowLineRight size={18} /> : <ArrowLineLeft size={20} />}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-800)' }} />

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
                    <MagnifyingGlassIcon size={18} color="var(--mui-palette-neutral-400)" />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'var(--SideNav-color)',
                  bgcolor: 'var(--mui-palette-neutral-900)',
                  borderRadius: 2,
                  '& fieldset': { borderColor: 'var(--mui-palette-neutral-700)' },
                  '&:hover fieldset': { borderColor: 'var(--mui-palette-neutral-600)' },
                  '&.Mui-focused fieldset': { borderColor: 'var(--mui-palette-primary-main)' },
                },
                '& input::placeholder': {
                  color: 'var(--mui-palette-neutral-400)',
                  opacity: 1,
                },
              }}
            />
          </Box>
        ) : null}

        {renderNavItems({ pathname, items: itemsFiltradosPorQuery, collapsed, query })}
      </Box>

      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-800)' }} />

      <Box sx={{ p: collapsed ? 1 : 1.5 }}>
        {/* <Tooltip title={collapsed ? `${userDisplayName}${userSecondaryText ? ` · ${userSecondaryText}` : ''}` : ''} placement="right"> */}
        <Tooltip title={collapsed ? 'TECNISERVICIOS - Panel administrativo ' : ''} placement="right">
          <Stack
            direction="row"
            spacing={1.25}
            sx={{
              alignItems: 'center',
              px: collapsed ? 0 : 1,
              py: 1,
              borderRadius: 2,
              bgcolor: 'var(--mui-palette-neutral-900)',
              border: '1px solid var(--mui-palette-neutral-700)',
              justifyContent: collapsed ? 'center' : 'flex-start',
              overflow: 'hidden',
            }}
          >
            <Avatar
              src="/assets/LogoCompanyLogoIco.png"
              sx={{
                width: 34,
                height: 34,
                bgcolor: 'var(--mui-palette-neutral-800)',
                color: 'var(--SideNav-color)',
                fontWeight: 700,
              }}
            >
              {(userDisplayName || 'U').charAt(0).toUpperCase()}
            </Avatar>
            {!collapsed ? (
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} variant="body2">
                  {/* {userDisplayName} */}
                  TECNISERVICIOS
                </Typography>
                {userSecondaryText ? (
                  <Typography sx={{ color: 'var(--mui-palette-neutral-400)', lineHeight: 1.2 }} variant="caption">
                    {/* {userSecondaryText} */}
                    Panel administrativo
                  </Typography>
                ) : null}
              </Box>
            ) : null}
          </Stack>
        </Tooltip>
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
    if (query && hasChildren) {
      setOpen(true);
    }
  }, [hasChildren, query]);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const content = (
    <div>
 <Box
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
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'not-allowed',
          }),
          ...(effectiveActive && { bgcolor: 'var(--NavItem-active-background)', color: 'var(--NavItem-active-color)' }),
          ...(effectiveActive
            ? {}
            : {
                '&:hover': {
                  bgcolor: 'var(--NavItem-hover-background)',
                },
              }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto', width: 22 }}>
          {Icon ? (
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
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
          PaperProps={{
            sx: {
              ml: 2,
              p: 1,
              minWidth: 220,
              bgcolor: 'var(--mui-palette-neutral-900)',
              color: 'var(--mui-palette-common-white)',
              border: '1px solid var(--mui-palette-neutral-700)',
              borderRadius: 2,
              boxShadow: '12px 12px 24px rgba(0, 0, 0, 0.35)',
              backdropFilter: 'blur(10px)',
            },
          }}
        >
          <Box sx={{ px: 1, py: 0.75 }}>
            <Typography sx={{ fontWeight: 700, lineHeight: 1.2 }} variant="subtitle2">
              {title}
            </Typography>
            <Typography sx={{ color: 'var(--mui-palette-neutral-400)', lineHeight: 1.2 }} variant="caption">
              Opciones
            </Typography>
          </Box>
          <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)', my: 0.5 }} />
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
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    color: 'var(--NavItem-color)',
                    textDecoration: 'none',
                    ...(sdisabled && { opacity: 0.6, pointerEvents: 'none' }),
                    transition: 'background-color 120ms ease',
                    '&:hover': { bgcolor: 'var(--mui-palette-neutral-800)' },
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
