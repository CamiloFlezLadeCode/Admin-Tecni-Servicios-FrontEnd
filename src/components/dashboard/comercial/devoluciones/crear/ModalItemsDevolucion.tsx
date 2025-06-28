// import React from 'react';
// import { Modal, Box, Typography, Grid, Button, Divider, IconButton } from '@mui/material';
// import InputSelect from '@/components/dashboard/componentes_generales/formulario/Select';
// import Input from '@/components/dashboard/componentes_generales/formulario/Input';

// const style = {
//   position: 'absolute',
//   top: '50%',
//   left: '50%',
//   transform: 'translate(-50%, -50%)',
//   width: '80%',
//   maxWidth: '1000px',
//   maxHeight: '80vh',
//   bgcolor: 'background.paper',
//   boxShadow: 24,
//   p: 4,
//   overflowY: 'auto'
// };

// interface ModalItemsDevolucionProps {
//   open: boolean;
//   onClose: () => void;
//   items: ItemRemision[];
//   motivos: {value: string, label: string}[];
//   estados: {value: string, label: string}[];
//   onActualizarItem: (id: string | number, campo: string, valor: any) => void;
// }

// export function ModalItemsDevolucion({ 
//   open, 
//   onClose, 
//   items, 
//   motivos, 
//   estados,
//   onActualizarItem 
// }: ModalItemsDevolucionProps) {
//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={style}>
//         <Typography variant="h6" component="h2" mb={2}>
//           Gestión de Items a Devolver
//         </Typography>
//         <Divider />
        
//         <Grid container spacing={2} sx={{ mt: 1 }}>
//           {items.map((item) => (
//             <React.Fragment key={item.id}>
//               <Grid item xs={12} md={3}>
//                 <Typography variant="subtitle2">{item.equipo}</Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   {item.categoria}
//                 </Typography>
//               </Grid>
              
//               <Grid item xs={6} md={2}>
//                 <Input
//                   label="Arrendado"
//                   value={item.cantidadArrendada}
//                   tamano="small"
//                   tipo_input="number"
//                   bloqueado
//                 />
//               </Grid>
              
//               <Grid item xs={6} md={2}>
//                 <Input
//                   label="Pendiente"
//                   value={item.cantidadPendiente}
//                   tamano="small"
//                   tipo_input="number"
//                   bloqueado
//                 />
//               </Grid>
              
//               <Grid item xs={6} md={1}>
//                 <Input
//                   label="A devolver"
//                   value={item.cantidadADevolver}
//                   onChange={(e) => onActualizarItem(
//                     item.id, 
//                     'cantidadADevolver', 
//                     Math.min(Number(e.target.value), item.cantidadPendiente)
//                   )}
//                   tamano="small"
//                   tipo_input="number"
//                   min={0}
//                   max={item.cantidadPendiente}
//                 />
//               </Grid>
              
//               <Grid item xs={6} md={2}>
//                 <InputSelect
//                   label="Estado"
//                   value={item.estadoDevolucion}
//                   options={estados}
//                   onChange={(e) => onActualizarItem(item.id, 'estadoDevolucion', e.target.value)}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid item xs={6} md={2}>
//                 <InputSelect
//                   label="Motivo"
//                   value={item.motivoDevolucion}
//                   options={motivos}
//                   onChange={(e) => onActualizarItem(item.id, 'motivoDevolucion', e.target.value)}
//                   size="small"
//                 />
//               </Grid>
              
//               <Grid item xs={12}>
//                 <Input
//                   label="Observaciones"
//                   value={item.observaciones}
//                   onChange={(e) => onActualizarItem(item.id, 'observaciones', e.target.value)}
//                   tamano="small"
//                   tipo_input="text"
//                 />
//               </Grid>
              
//               <Grid item xs={12}>
//                 <Divider sx={{ my: 2 }} />
//               </Grid>
//             </React.Fragment>
//           ))}
//         </Grid>
        
//         <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//           <Button onClick={onClose} variant="contained">
//             Cerrar
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }