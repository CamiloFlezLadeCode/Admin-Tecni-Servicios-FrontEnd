import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const MostrarItemsRemision = async (IdRemsion: any) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.devoluciones.mostrar_items_remision, {
            params: {
                IdRemision: IdRemsion
            }
        });
        return data;
    } catch (error) {
        console.log("Error al mostrar los items de la remisión");
        throw error;
    }
};