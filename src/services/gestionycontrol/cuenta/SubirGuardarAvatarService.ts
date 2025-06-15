import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const GuardarAvatar = async (formData: FormData, nombreAvatar: string) => {
    try {
        const { data } = await axiosInstance.post(
            `${apiRoutes.gestionycontrol.cuenta.subir_guardar_avatar}?nombre=${encodeURIComponent(nombreAvatar)}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return data;
    } catch (error: any) {
        console.error("Error al guardar el avatar:", error.response?.data || error.message);
        throw error;
    }
};
