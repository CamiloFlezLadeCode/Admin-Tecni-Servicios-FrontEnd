// import axiosInstance from "@/config/axiosConfig";
// import { apiRoutes } from "@/config/apiRoutes";

// export const ObtenerPDFRemision = async (IdRemision: number) => {
//     try {
//         const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.ver_pdf_remision(IdRemision));
//         return data;
//     } catch (error: any) {
//         console.log("Error al visualizar el PDF de la remisión");
//         throw new Error(` => ${error.response.data.error}`);
//     }
// };

// import axiosInstance from "@/config/axiosConfig";
// import { apiRoutes } from "@/config/apiRoutes";

// export const VisualizarPDFRemision = async (IdRemision: number) => {
//     try {
//         const response = await axiosInstance.get(
//             apiRoutes.comercial.remisiones.ver_pdf_remision(IdRemision),
//             { responseType: 'blob' }
//         );

//         const blob = new Blob([response.data], { type: 'application/pdf' });
//         const url = URL.createObjectURL(blob);
//         window.open(url, '_blank');
//     } catch (error: any) {
//         console.log("Error al visualizar el PDF de la remisión");
//         throw new Error(` => ${error?.response?.data?.error || 'Error desconocido'}`);
//     }
// };



// services/VisualizarPDFRemision.ts
import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

// export const VisualizarPDFRemision = async (IdRemision: number): Promise<Blob> => {
//     try {
//         const response = await axiosInstance.get(
//             apiRoutes.comercial.remisiones.ver_pdf_remision(IdRemision),
//             { responseType: 'blob' } // 👈 esto asegura que axios devuelva un Blob
//         );
//         return response.data; // 👈 asegúrate de retornar el blob correctamente
//     } catch (error: any) {
//         console.error("Error al visualizar el PDF de la remisión");
//         throw new Error(` => ${error.response?.data?.error}`);
//     }
// };


export const VisualizarPDFRemision = async (IdRemision: number): Promise<Blob> => {
  const response = await axiosInstance.get(
    apiRoutes.comercial.remisiones.ver_pdf_remision(IdRemision),
    { responseType: 'blob' }
  );
  return response.data;
};

