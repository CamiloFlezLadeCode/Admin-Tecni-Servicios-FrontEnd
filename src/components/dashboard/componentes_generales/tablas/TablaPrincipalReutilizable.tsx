// 'use client';

// // import * as React from 'react';
// import { UserContext } from '@/contexts/user-context';
// import { useState, useMemo, useContext } from 'react';
// import {
//     Box,
//     Paper,
//     Table,
//     TableBody,
//     TableCell,
//     TableContainer,
//     TableHead,
//     TableRow,
//     Typography,
//     Skeleton,
//     IconButton,
//     Tooltip,
//     TextField,
//     InputAdornment,
//     TablePagination,
//     Chip,
//     Card,
//     CardContent
// } from '@mui/material';
// import { TABLE_PADDING } from '@/styles/theme/padding-table';
// import { ArrowsClockwise, Eye, PencilSimple, MagnifyingGlass, X } from '@phosphor-icons/react';

// export type ColumnDefinition<T> = {
//     key: string;
//     header: string;
//     width?: string | number;
//     align?: 'left' | 'center' | 'right';
//     render?: (row: T) => React.ReactNode;
//     sortable?: boolean;
//     hidden?: boolean;
// };

// export type ActionDefinition<T> = {
//     icon?: React.ReactNode;
//     tooltip: string;
//     onClick?: (row: T) => void;
//     color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'; // Valores específicos
//     hidden?: (row: T) => boolean;
//     render?: (row: T) => React.ReactNode; // Nueva prop para renderizado personalizado
// };

// interface DataTableProps<T> {
//     data: T[];
//     columns: ColumnDefinition<T>[];
//     actions?: ActionDefinition<T>[];
//     loading?: boolean;
//     error?: string | null;
//     searchTerm?: string;
//     onSearchChange?: (term: string) => void;
//     pagination?: boolean;
//     rowsPerPageOptions?: number[];
//     defaultRowsPerPage?: number;
//     onRefresh?: () => void;
//     emptyMessage?: string;
//     rowKey?: (row: T) => string | number;
//     stickyHeader?: boolean;
//     maxHeight?: string | number;
//     showSummary?: boolean;
//     customFilters?: React.ReactNode;
//     placeHolderBuscador: string;
// }

// export function DataTable<T>({
//     data = [],
//     columns = [],
//     actions = [],
//     loading = false,
//     error = null,
//     searchTerm = '',
//     onSearchChange,
//     pagination = true,
//     rowsPerPageOptions = [5, 10, 25],
//     defaultRowsPerPage = 10,
//     onRefresh,
//     emptyMessage = 'No se encontraron registros',
//     rowKey = (row: any) => row.id || Math.random(),
//     stickyHeader = true,
//     maxHeight = '60vh',
//     showSummary = true,
//     customFilters,
//     placeHolderBuscador
// }: DataTableProps<T>) {
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

//     const { user } = useContext(UserContext) || { user: null };
//     const RolUsuario = user ? `${user.rol}` : null;

//     const filteredData = useMemo(() => {
//         if (!searchTerm) return data;
//         return data.filter(item =>
//             columns.some(column => {
//                 const value = column.render
//                     ? String(column.render(item))
//                     : String((item as any)[column.key]);
//                 return value.toLowerCase().includes(searchTerm.toLowerCase());
//             })
//         );
//     }, [data, searchTerm, columns]);

//     const visibleColumns = useMemo(() =>
//         columns.filter(column => !column.hidden),
//         [columns]
//     );

//     const handleChangePage = (event: unknown, newPage: number) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const paginatedData = pagination
//         ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//         : filteredData;

//     return (
//         <Card>
//             <CardContent>
//                 <Box sx={{ width: '100%' }}>
//                     {/* Search and Filters Area */}
//                     <Box sx={{
//                         display: 'flex',
//                         justifyContent: 'space-between',
//                         alignItems: 'center',
//                         mb: 2,
//                         gap: 2,
//                         flexWrap: 'wrap'
//                     }}>
//                         {onSearchChange && (
//                             <TextField
//                                 variant="outlined"
//                                 size="small"
//                                 placeholder={placeHolderBuscador}
//                                 value={searchTerm}
//                                 onChange={(e) => onSearchChange(e.target.value)}
//                                 InputProps={{
//                                     startAdornment: (
//                                         <InputAdornment position="start">
//                                             <MagnifyingGlass size={20} />
//                                         </InputAdornment>
//                                     ),
//                                     endAdornment: searchTerm && (
//                                         <IconButton>
//                                             <X onClick={() => onSearchChange('')} />
//                                         </IconButton>
//                                     )
//                                 }}
//                                 sx={{ width: 300, minWidth: 200 }}
//                             />
//                         )}

//                         {customFilters}

//                         <Box display="flex" gap={1}>
//                             {onRefresh && (
//                                 <Tooltip title="Actualizar datos">
//                                     <IconButton onClick={onRefresh} color="primary">
//                                         <ArrowsClockwise size={20} />
//                                     </IconButton>
//                                 </Tooltip>
//                             )}
//                         </Box>
//                     </Box>

//                     {/* Table Area */}
//                     <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
//                         <TableContainer sx={{ maxHeight: stickyHeader ? maxHeight : undefined }}>
//                             <Table stickyHeader={stickyHeader} aria-label="data-table">
//                                 <TableHead>
//                                     <TableRow>
//                                         {visibleColumns.map((column) => (
//                                             <TableCell
//                                                 key={column.key}
//                                                 sx={{
//                                                     fontWeight: 'bold',
//                                                     color: '#000000 !important',
//                                                     width: column.width,
//                                                     textAlign: column.align || 'left'
//                                                 }}
//                                             >
//                                                 {column.header}
//                                             </TableCell>
//                                         ))}
//                                         {(actions.length > 0 && RolUsuario === 'Administrador') && (
//                                             <TableCell
//                                                 sx={{
//                                                     fontWeight: 'bold',
//                                                     color: '#000000 !important',
//                                                     width: '120px',
//                                                     textAlign: 'center'
//                                                 }}
//                                             >
//                                                 Acciones
//                                             </TableCell>
//                                         )}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {loading ? (
//                                         Array.from({ length: rowsPerPage }).map((_, index) => (
//                                             <TableRow key={index}>
//                                                 {visibleColumns.map((column) => (
//                                                     <TableCell key={`${column.key}-${index}`}>
//                                                         <Skeleton animation="wave" height={40} />
//                                                     </TableCell>
//                                                 ))}
//                                                 {(actions.length > 0 && RolUsuario === 'Administrador') && (
//                                                     <TableCell>
//                                                         <Skeleton animation="wave" height={40} />
//                                                     </TableCell>
//                                                 )}
//                                             </TableRow>
//                                         ))
//                                     ) : error ? (
//                                         <TableRow>
//                                             <TableCell
//                                                 colSpan={visibleColumns.length + (actions.length > 0 ? 1 : 0)}
//                                                 align="center"
//                                                 sx={{ color: 'error.main' }}
//                                             >
//                                                 {error}
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : filteredData.length === 0 ? (
//                                         <TableRow>
//                                             <TableCell
//                                                 colSpan={visibleColumns.length + (actions.length > 0 ? 1 : 0)}
//                                                 align="center"
//                                             >
//                                                 {emptyMessage}
//                                             </TableCell>
//                                         </TableRow>
//                                     ) : (
//                                         paginatedData.map((row) => (
//                                             <TableRow hover key={rowKey(row)}>
//                                                 {visibleColumns.map((column) => (
//                                                     <TableCell
//                                                         key={`${column.key}-${rowKey(row)}`}
//                                                         sx={TABLE_PADDING}
//                                                         align={column.align || 'left'}
//                                                     >
//                                                         {column.render
//                                                             ? column.render(row)
//                                                             : (row as any)[column.key]}
//                                                     </TableCell>
//                                                 ))}
//                                                 {(actions.length > 0 && RolUsuario === 'Administrador') && (
//                                                     <TableCell
//                                                         align="center"
//                                                         sx={TABLE_PADDING}
//                                                     >
//                                                         <Box display="flex" justifyContent="center" gap={1}>
//                                                             {/* {actions.map((action, index) => (
//                                                                 !action.hidden?.(row) && (
//                                                                     <Tooltip key={index} title={action.tooltip}>
//                                                                         <IconButton
//                                                                             onClick={() => action.onClick(row)}
//                                                                             color={action.color || 'primary'}
//                                                                         >
//                                                                             {action.icon}
//                                                                         </IconButton>
//                                                                     </Tooltip>
//                                                                 )
//                                                             ))} */}
//                                                             {actions.map((action, index) => {
//                                                                 if (action.render) {
//                                                                     return (
//                                                                         <Tooltip key={index} title={action.tooltip}>
//                                                                             <Box display="inline-flex">
//                                                                                 {action.render(row)}
//                                                                             </Box>
//                                                                         </Tooltip>
//                                                                     );
//                                                                 }

//                                                                 return (
//                                                                     !action.hidden?.(row) && (
//                                                                         <Tooltip key={index} title={action.tooltip}>
//                                                                             <IconButton
//                                                                                 onClick={() => action.onClick?.(row)}
//                                                                                 color={action.color || 'primary'}
//                                                                             >
//                                                                                 {action.icon}
//                                                                             </IconButton>
//                                                                         </Tooltip>
//                                                                     )
//                                                                 );
//                                                             })}
//                                                         </Box>
//                                                     </TableCell>
//                                                 )}
//                                             </TableRow>
//                                         ))
//                                     )}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>

//                         {pagination && (
//                             <TablePagination
//                                 rowsPerPageOptions={rowsPerPageOptions}
//                                 component="div"
//                                 count={filteredData.length}
//                                 rowsPerPage={rowsPerPage}
//                                 page={page}
//                                 onPageChange={handleChangePage}
//                                 onRowsPerPageChange={handleChangeRowsPerPage}
//                                 labelRowsPerPage="Filas por página:"
//                                 labelDisplayedRows={({ from, to, count }) =>
//                                     `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
//                                 }
//                                 sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
//                             />
//                         )}
//                     </Paper>

//                     {showSummary && !loading && !error && filteredData.length > 0 && (
//                         <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
//                             Mostrando {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredData.length)} de {filteredData.length} registros
//                         </Typography>
//                     )}
//                 </Box>
//             </CardContent>
//         </Card>
//     );
// }



// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
'use client';

import { UserContext } from '@/contexts/user-context';
import { useState, useMemo, useContext } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Skeleton,
    IconButton,
    Tooltip,
    TextField,
    InputAdornment,
    TablePagination,
    Chip,
    Card,
    CardContent
} from '@mui/material';
import { TABLE_PADDING } from '@/styles/theme/padding-table';
import { ArrowsClockwise, Eye, PencilSimple, MagnifyingGlass, X } from '@phosphor-icons/react';

export type ColumnDefinition<T> = {
    key: string;
    header: string;
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
    hidden?: boolean;
};

export type ActionDefinition<T> = {
    icon?: React.ReactNode;
    tooltip: string;
    onClick?: (row: T) => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    hidden?: (row: T) => boolean;
    render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
    data: T[];
    columns: ColumnDefinition<T>[];
    actions?: ActionDefinition<T>[];
    loading?: boolean;
    error?: string | null;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    pagination?: boolean;
    rowsPerPageOptions?: number[];
    defaultRowsPerPage?: number;
    onRefresh?: () => void;
    emptyMessage?: string;
    rowKey?: (row: T) => string | number;
    stickyHeader?: boolean;
    maxHeight?: string | number;
    showSummary?: boolean;
    customFilters?: React.ReactNode;
    placeHolderBuscador: string;
}

export function DataTable<T>({
    data = [],
    columns = [],
    actions = [],
    loading = false,
    error = null,
    searchTerm = '',
    onSearchChange,
    pagination = true,
    rowsPerPageOptions = [5, 10, 25],
    defaultRowsPerPage = 10,
    onRefresh,
    emptyMessage = 'No se encontraron registros',
    rowKey = (row: any) => row.id || Math.random(),
    stickyHeader = true,
    maxHeight = '60vh',
    showSummary = true,
    customFilters,
    placeHolderBuscador
}: DataTableProps<T>) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

    const { user } = useContext(UserContext) || { user: null };
    const RolUsuario = user ? `${user.rol}` : null;

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;
        return data.filter(item =>
            columns.some(column => {
                const value = column.render
                    ? String(column.render(item))
                    : String((item as any)[column.key]);
                return value.toLowerCase().includes(searchTerm.toLowerCase());
            })
        );
    }, [data, searchTerm, columns]);

    const visibleColumns = useMemo(() =>
        columns.filter(column => !column.hidden),
        [columns]
    );

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = pagination
        ? filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
        : filteredData;

    return (
        <Card>
            <CardContent>
                <Box sx={{ width: '100%' }}>
                    {/* Search and Filters Area */}
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                        gap: 2,
                        flexWrap: 'wrap'
                    }}>
                        {onSearchChange && (
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder={placeHolderBuscador}
                                value={searchTerm}
                                onChange={(e) => onSearchChange(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MagnifyingGlass size={20} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: searchTerm && (
                                        <IconButton>
                                            <X onClick={() => onSearchChange('')} />
                                        </IconButton>
                                    )
                                }}
                                sx={{ width: 300, minWidth: 200 }}
                            />
                        )}

                        {customFilters}

                        <Box display="flex" gap={1}>
                            {onRefresh && (
                                <Tooltip title="Actualizar datos">
                                    <IconButton onClick={onRefresh} color="primary">
                                        <ArrowsClockwise size={20} />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Box>
                    </Box>

                    {/* Table Area */}
                    <Paper sx={{ width: '100%', overflow: 'hidden', mb: 2 }}>
                        <TableContainer 
                            sx={{ 
                                maxHeight: stickyHeader ? maxHeight : undefined,
                                position: 'relative',
                                overflow: 'auto'
                            }}
                        >
                            <Table 
                                stickyHeader={stickyHeader} 
                                aria-label="data-table"
                                sx={{
                                    // Estilo para fijar la columna de acciones
                                    '& .MuiTableCell-root:last-child': {
                                        position: 'sticky',
                                        right: 0,
                                        backgroundColor: 'white',
                                        zIndex: 10,
                                        boxShadow: '-2px 0px 4px rgba(0,0,0,0.1)'
                                    },
                                    '& .MuiTableHead-root .MuiTableCell-root:last-child': {
                                        backgroundColor: '#f5f5f5',
                                        zIndex: 11
                                    },
                                    '& .MuiTableRow-hover:hover .MuiTableCell-root:last-child': {
                                        backgroundColor: '#f5f5f5'
                                    }
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        {visibleColumns.map((column) => (
                                            <TableCell
                                                key={column.key}
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#000000 !important',
                                                    width: column.width,
                                                    textAlign: column.align || 'left'
                                                }}
                                            >
                                                {column.header}
                                            </TableCell>
                                        ))}
                                        {(actions.length > 0 && RolUsuario === 'Administrador') && (
                                            <TableCell
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#000000 !important',
                                                    width: '120px',
                                                    textAlign: 'center',
                                                    minWidth: '120px'
                                                }}
                                            >
                                                Acciones
                                            </TableCell>
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loading ? (
                                        Array.from({ length: rowsPerPage }).map((_, index) => (
                                            <TableRow key={index}>
                                                {visibleColumns.map((column) => (
                                                    <TableCell key={`${column.key}-${index}`}>
                                                        <Skeleton animation="wave" height={40} />
                                                    </TableCell>
                                                ))}
                                                {(actions.length > 0 && RolUsuario === 'Administrador') && (
                                                    <TableCell>
                                                        <Skeleton animation="wave" height={40} />
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    ) : error ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={visibleColumns.length + (actions.length > 0 ? 1 : 0)}
                                                align="center"
                                                sx={{ color: 'error.main' }}
                                            >
                                                {error}
                                            </TableCell>
                                        </TableRow>
                                    ) : filteredData.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={visibleColumns.length + (actions.length > 0 ? 1 : 0)}
                                                align="center"
                                            >
                                                {emptyMessage}
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedData.map((row) => (
                                            <TableRow hover key={rowKey(row)}>
                                                {visibleColumns.map((column) => (
                                                    <TableCell
                                                        key={`${column.key}-${rowKey(row)}`}
                                                        sx={TABLE_PADDING}
                                                        align={column.align || 'left'}
                                                    >
                                                        {column.render
                                                            ? column.render(row)
                                                            : (row as any)[column.key]}
                                                    </TableCell>
                                                ))}
                                                {(actions.length > 0 && RolUsuario === 'Administrador') && (
                                                    <TableCell
                                                        align="center"
                                                        sx={{
                                                            ...TABLE_PADDING,
                                                            position: 'sticky',
                                                            right: 0,
                                                            backgroundColor: 'white',
                                                            zIndex: 10,
                                                            boxShadow: '-2px 0px 4px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <Box display="flex" justifyContent="center" gap={1}>
                                                            {actions.map((action, index) => {
                                                                if (action.render) {
                                                                    return (
                                                                        <Tooltip key={index} title={action.tooltip}>
                                                                            <Box display="inline-flex">
                                                                                {action.render(row)}
                                                                            </Box>
                                                                        </Tooltip>
                                                                    );
                                                                }

                                                                return (
                                                                    !action.hidden?.(row) && (
                                                                        <Tooltip key={index} title={action.tooltip}>
                                                                            <IconButton
                                                                                onClick={() => action.onClick?.(row)}
                                                                                color={action.color || 'primary'}
                                                                                size="small"
                                                                            >
                                                                                {action.icon}
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    )
                                                                );
                                                            })}
                                                        </Box>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {pagination && (
                            <TablePagination
                                rowsPerPageOptions={rowsPerPageOptions}
                                component="div"
                                count={filteredData.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Filas por página:"
                                labelDisplayedRows={({ from, to, count }) =>
                                    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
                                }
                                sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)' }}
                            />
                        )}
                    </Paper>

                    {showSummary && !loading && !error && filteredData.length > 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Mostrando {page * rowsPerPage + 1}-{Math.min((page + 1) * rowsPerPage, filteredData.length)} de {filteredData.length} registros
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
}