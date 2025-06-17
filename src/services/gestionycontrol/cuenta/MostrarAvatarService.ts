// import axiosInstance from "@/config/axiosConfig";
// import { apiRoutes } from "@/config/apiRoutes";

// export const MostrarAvatar = async (DocumentoUsuarioActivo: string) => {
//     try {
//         const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.cuenta.mostrar_avatar_usuario_activo(DocumentoUsuarioActivo));
//         return data;
//     } catch (error: any) {
//         console.error("Error al mostrar el avatar:", error.response?.data || error.message);
//         throw error;
//     }
// };


import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const MostrarAvatar = async (DocumentoUsuarioActivo: string): Promise<string> => {
  const url = apiRoutes.gestionycontrol.cuenta.mostrar_avatar_usuario_activo(DocumentoUsuarioActivo);

  try {
    // HEAD pide solo headers, no descarga la imagen
    await axiosInstance.head(url);
    return url; // La imagen existe
  } catch (error: any) {
    // Si falla, usamos avatar por defecto
    console.warn("No se encontró el avatar, usando imagen por defecto.");
    return "/assets/AvatarDefault.png";
  }
};
