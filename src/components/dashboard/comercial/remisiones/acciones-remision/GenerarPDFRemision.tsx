'use client';

import * as React from 'react';
import {
    FilePdf,
    Printer
} from '@phosphor-icons/react/dist/ssr';
import {
    IconButton
} from '@mui/material';
import { VisualizarPDFRemision } from '@/services/comercial/remisiones/ObtenerPDFRemisionService';


// interface Props {
//     IdRemision: number;
// }
// export function GenerarPDFRemision({ IdRemision }: Props): React.JSX.Element {
//     const [pdf, setPDF] = React.useState('');
//     const manejarImpresion = async () => {
//         // window.print(); // Abre el diálogo de impresión del navegador
//         console.log(IdRemision);
//         const pdf = await VisualizarPDFRemision(IdRemision);
//         setPDF(pdf);
//     };
//     return (
//         <>
//             <IconButton
//                 size="small"
//                 color="default"
//                 onClick={manejarImpresion}
//             >
//                 <FilePdf size={20} weight="bold" />
//             </IconButton>

//             <iframe
//                 src={pdf}
//                 width="100%"
//                 height="700px"
//             />
//         </>
//     )
// };


interface Props {
    IdRemision: number;
}

// export function GenerarPDFRemision({ IdRemision }: Props): React.JSX.Element {
//     const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

//     const manejarImpresion = async () => {
//         try {
//             const pdfBlob = await VisualizarPDFRemision(IdRemision);
//             const url = URL.createObjectURL(pdfBlob);
//             setPdfUrl(url);
//         } catch (error) {
//             console.error("Error mostrando el PDF:", error);
//         }
//     };

//     return (
//         <>
//             <IconButton
//                 size="small"
//                 color="default"
//                 onClick={manejarImpresion}
//             >
//                 <FilePdf size={20} weight="bold" />
//             </IconButton>

//             {pdfUrl && (
//                 <iframe
//                     src={pdfUrl}
//                     width="100%"
//                     height="700px"
//                     style={{ border: 'none', marginTop: '1rem' }}
//                 />
//             )}
//         </>
//     );
// }

// export function GenerarPDFRemision({ IdRemision }: Props): React.JSX.Element {
//   const manejarImpresion = async () => {
//     try {
//       const blob = await VisualizarPDFRemision(IdRemision);
//       const url = URL.createObjectURL(blob);

//       const nuevaVentana = window.open(url, '_blank');

//       if (nuevaVentana) {
//         // nuevaVentana.onload = () => {
//         //   nuevaVentana.print();
//         // };
//       } else {
//         alert("Por favor habilita los pop-ups para poder ver/imprimir el PDF");
//       }

//     } catch (error) {
//       console.error("Error visualizando PDF:", error);
//     }
//   };

//   return (
//     <IconButton
//       size="small"
//       color="default"
//       onClick={manejarImpresion}
//     >
//       <FilePdf size={20} weight="bold" />
//     </IconButton>
//   );
// }




// export function GenerarPDFRemision({ IdRemision }: Props): React.JSX.Element {
//   const manejarImpresion = async () => {
//     try {
//       // 1. Obtener el PDF como Blob
//       const blob = await VisualizarPDFRemision(IdRemision);

//       // 2. Crear una URL temporal
//       const blobURL = URL.createObjectURL(blob);

//       // 3. Crear una ventana nueva
//       const ventana = window.open('', '_blank');

//       if (!ventana) {
//         alert("Habilita los pop-ups del navegador para ver el PDF");
//         return;
//       }

//       // 4. Escribir el contenido con un iframe embebido
//       ventana.document.write(`
//         <html>
//           <head>
//             <title>Remisión</title>
//             <style>
//               body, html { margin: 0; padding: 0; height: 100%; }
//               iframe { width: 100%; height: 100%; border: none; }
//             </style>
//           </head>
//           <body>
//             <iframe src="${blobURL}" onload="this.contentWindow.print()" />
//           </body>
//         </html>
//       `);

//       ventana.document.close();

//     } catch (error) {
//       console.error("Error visualizando PDF:", error);
//     }
//   };

//   return (
//     <IconButton
//       size="small"
//       color="default"
//       onClick={manejarImpresion}
//     >
//       <FilePdf size={20} weight="bold" />
//     </IconButton>
//   );
// }




// export function GenerarPDFRemision({ IdRemision }: Props): React.JSX.Element {
//   const manejarImpresion = async () => {
//     try {
//       const blob = await VisualizarPDFRemision(IdRemision);
//       const blobURL = URL.createObjectURL(blob);

//       // Sobrescribe el documento actual con un visor de PDF + auto print
//       document.open();
//       document.write(`
//         <html>
//           <head>
//             <title>Imprimir Remisión</title>
//             <style>
//               html, body { margin: 0; height: 100%; }
//               iframe { border: none; width: 100%; height: 100%; }
//             </style>
//           </head>
//           <body>
//             <iframe id="pdfFrame" src="${blobURL}"></iframe>
//             <script>
//               const iframe = document.getElementById('pdfFrame');
//               iframe.onload = function() {
//                 setTimeout(() => {
//                   iframe.contentWindow.focus();
//                   iframe.contentWindow.print();
//                 }, 500);
//               };
//             </script>
//           </body>
//         </html>
//       `);
//       document.close();

//     } catch (error) {
//       console.error("Error al imprimir PDF:", error);
//     }
//   };

//   return (
//     <IconButton size="small" color="default" onClick={manejarImpresion}>
//       <FilePdf size={20} weight="bold" />
//     </IconButton>
//   );
// }







// CASIII
// export function GenerarPDFRemision({ IdRemision }: Props): React.JSX.Element {
//   const manejarImpresion = async () => {
//     try {
//       const blob = await VisualizarPDFRemision(IdRemision);
//       const blobURL = URL.createObjectURL(blob);

//       // Crea un iframe oculto
//       const iframe = document.createElement('iframe');
//       iframe.style.display = 'none';
//       iframe.src = blobURL;
//       document.body.appendChild(iframe);

//       iframe.onload = () => {
//         iframe.contentWindow?.focus();
//         iframe.contentWindow?.print();

//         // // Elimina el iframe después de imprimir
//         // setTimeout(() => {
//         //   URL.revokeObjectURL(blobURL);
//         //   document.body.removeChild(iframe);
//         // }, 1000);
//       };

//     } catch (error) {
//       console.error("Error al imprimir PDF:", error);
//     }
//   };

//   return (
//     <IconButton size="small" color="default" onClick={manejarImpresion}>
//       <FilePdf size={20} weight="bold" />
//     </IconButton>
//   );
// }



export function GenerarPDFRemision({ IdRemision }: Props): React.JSX.Element {
    // Con vista directa de impresión en la misma pestaña
    const manejarImpresion = async () => {
        try {
            const blob = await VisualizarPDFRemision(IdRemision);
            const blobURL = URL.createObjectURL(blob);

            const esMovil = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (esMovil) {
                const link = document.createElement('a');
                link.href = blobURL;
                link.download = `remision-No${IdRemision}.pdf`;
                link.click();
                return;
            }

            // Desktop: imprimir
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobURL;
            document.body.appendChild(iframe);

            iframe.onload = () => {
                iframe.contentWindow?.focus();
                iframe.contentWindow?.print();

                // setTimeout(() => {
                //   URL.revokeObjectURL(blobURL);
                //   document.body.removeChild(iframe);
                // }, 1000);
            };

        } catch (error) {
            console.error("Error al imprimir PDF:", error);
        }
    };

    // Con PDF en nueva pestaña
    const manejarImpresionC = async () => {
        try {
            const blob = await VisualizarPDFRemision(IdRemision);
            const blobURL = URL.createObjectURL(blob);

            // Abrir el PDF en una nueva pestaña
            window.open(blobURL, '_blank');

        } catch (error) {
            console.error("Error al mostrar PDF:", error);
        }
    };

    return (
        <IconButton size="small" color="default" onClick={manejarImpresion}>
            <Printer size={20} weight="bold" />
        </IconButton>
    );
}
