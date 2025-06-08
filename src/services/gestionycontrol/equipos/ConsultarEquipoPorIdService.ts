import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const ConsultarEquipoPorId = async (IdEquipo: number) => {
    try {
        const { data } = await axiosInstance.get(apiRoutes.gestionycontrol.equipos.verequipoporid(IdEquipo));
        return data;
    } catch (error) {
        throw new Error(`Error al consultar la información del equipo: ${error}`);
    }
};