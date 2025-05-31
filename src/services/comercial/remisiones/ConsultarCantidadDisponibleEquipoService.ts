import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarCantidadDisponibleEquipo = async (IdEquipo: number) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.comercial.remisiones.consultarcantidaddisponiblequipo(IdEquipo))
        return data;
    } catch (error) {
        console.log("Error al consultar la cantidad disponible del equipo");
        throw new Error(`Error => ${error}`);
    }
};