'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Popover from '@mui/material/Popover';
// import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import { ArrowsInLineHorizontal } from '@phosphor-icons/react/dist/ssr/ArrowsInLineHorizontal'
import { ArrowLineLeft } from '@phosphor-icons/react/dist/ssr/ArrowLineLeft' 
import { ArrowLineRight } from '@phosphor-icons/react/dist/ssr/ArrowLineRight'  

// import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
// import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

import { CaretDown, CaretRight } from '@phosphor-icons/react/dist/ssr';

import { UserContext } from '@/contexts/user-context';
import { height } from '@mui/system';

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

  React.useEffect(() => {
    document.body.style.setProperty('--SideNav-width', collapsed ? '72px' : '280px');
  }, [collapsed]);

  const toggleSidebar = () => {
    const next = !collapsed;
    setCollapsed(next);
    document.body.style.setProperty('--SideNav-width', next ? '72px' : '280px');
    window.localStorage.setItem('sidebar-collapsed', String(next));
  };

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
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack direction="column" spacing={1.5} sx={{ py: collapsed ? 1 : 2, px: collapsed ? 0 : 3, alignItems: 'center', justifyContent: 'center' }}>
        <Box
          component={RouterLink}
          href={paths.home}
          sx={{
            display: 'inline-flex',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            height: 128,
            position: 'relative',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              transition: 'opacity 600ms ease-in-out, transform 600ms ease-in-out',
              opacity: collapsed ? 0 : 1,
              transform: collapsed ? 'scale(0.96)' : 'scale(1)'
            }}
          >
            <Logo color="light" height={128} width={222} />
          </Box>
          <Box
            sx={{
              position: 'absolute',
              transition: 'opacity 600ms ease-in-out, transform 600ms ease-in-out',
              opacity: collapsed ? 1 : 0,
              transform: collapsed ? 'scale(1.08)' : 'scale(0.96)',
              inset: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Box component="img" src="/assets/favicon.ico" alt="logo" sx={{ width: '85%', height: '85%', objectFit: 'contain' }} />
          </Box>
        </Box>
        <Tooltip title={collapsed ? 'Expandir' : 'Contraer'} placement="top">
          <IconButton
            aria-label={collapsed ? 'Expandir sidebar' : 'Contraer sidebar'}
            onClick={toggleSidebar}
            sx={{
              color: 'var(--mui-palette-neutral-200)',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--mui-palette-neutral-700)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
              minWidth: collapsed ? 32 : 40,
              minHeight: collapsed ? 32 : 40,
            }}
          >
            {collapsed ? <ArrowLineRight size={18} /> : <ArrowLineLeft size={20} />}
          </IconButton>
        </Tooltip>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px', overflowY: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' } }} tabIndex={0}>
        {renderNavItems({ pathname, items: itemsFiltrados, collapsed })}
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
    </Box>
  );
}

function renderNavItems({ items = [], pathname, collapsed = false }: { items?: NavItemConfig[]; pathname: string; collapsed?: boolean }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} collapsed={collapsed} {...item} />);

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
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title, items, collapsed }: NavItemProps): React.JSX.Element {
  const isChildActive = items?.some((item) =>
    isNavItemActive({ ...item, pathname })
  );
  const [open, setOpen] = React.useState(isChildActive);
  // const [open, setOpen] = React.useState(false);
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;
  const hasChildren = items && items.length > 0;
  const [flyAnchor, setFlyAnchor] = React.useState<HTMLElement | null>(null);
  const flyOpen = Boolean(flyAnchor);

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
        onClick={handleToggle}
        onMouseEnter={(e) => {
          if (collapsed && hasChildren) setFlyAnchor(e.currentTarget as HTMLElement);
        }}
        onMouseLeave={() => {
          if (collapsed && hasChildren) setFlyAnchor(null);
        }}
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
        <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0, marginLeft: '20px' }}>
          {items.map((subItem) => {
            const { key, ...rest } = subItem;
            return (
              <NavItem
                key={key}
                pathname={pathname}
                collapsed={collapsed}
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
          onClose={() => setFlyAnchor(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          PaperProps={{ sx: { mt: 0.5, p: 1, minWidth: 180 } }}
        >
          <Stack component="ul" spacing={0} sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {items.map((subItem) => {
              const { key, title: stitle, href: shref, external: sexternal } = subItem;
              return (
                <Box
                  key={key}
                  component={sexternal ? 'a' : RouterLink}
                  href={shref}
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 1,
                    color: 'var(--NavItem-color)',
                    textDecoration: 'none',
                    '&:hover': { bgcolor: 'var(--NavItem-hover-background)', color: 'var(--NavItem-hover-color)' },
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
        <Tooltip title={title} placement="right">{content}</Tooltip>
      ) : (
        content
      )}
    </li>
  );
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