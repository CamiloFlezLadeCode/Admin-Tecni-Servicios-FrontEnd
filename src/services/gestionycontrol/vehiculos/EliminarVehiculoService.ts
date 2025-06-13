// import axiosInstance from "@/config/axiosConfig";
// import { apiRoutes } from "@/config/apiRoutes";

// export const EliminarVehiculo = async (IdVehiculo: number) => {
//     try {
//         const { data } = await axiosInstance.delete(apiRoutes.vehiculos.eliminarvehiculo(IdVehiculo));
//         return data;
//     } catch (error: any) {
//         // throw Error(`Error al eliminar el equipo: ${error.response}`);
//         console.log(error.response.data.mensaje);
//         // throw new Error(`${error.response.data.mensaje}`);
//         console.log(error.response);
//         throw new Error(`${error.response}`);
//     }
// };


import axios from "axios";
import axiosInstance from "@/config/axiosConfig";
import { apiRoutes } from "@/config/apiRoutes";

export const EliminarVehiculo = async (IdVehiculo: number) => {
    try {
        const { data } = await axiosInstance.delete(apiRoutes.vehiculos.eliminarvehiculo(IdVehiculo));
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            // console.log(error.response?.data?.mensaje);
            throw error; // ✅ Propaga el error de Axios sin perder la estructura
        } else {
            throw new Error("Error desconocido al eliminar el vehículo.");
        }
    }
};
