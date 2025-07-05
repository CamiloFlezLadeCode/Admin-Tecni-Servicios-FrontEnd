import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";
import axios from "axios";

export const CrearRemision = async (datos: any) => {
    try {
        const { data } = await axiosInstance.post(apiRoutes.comercial.remisiones.crearremision, datos);
        return data;
    } catch (error: any) {
        // console.log("Error al crear la remisión");
        // throw new Error(` => ${error.response.data.error}`);
        if (axios.isAxiosError(error)) {
            // console.log(error.response?.data?.mensaje);
            throw error; // ✅ Propaga el error de Axios sin perder la estructura
        } else {
            throw new Error("Error desconocido al crear la remisión.");
        }
    }
};