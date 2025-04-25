// import axios, { AxiosError } from 'axios'; // Asegúrate de importar axios
import axios from 'axios';
import axiosInstance from "@/lib/axiosConfig";

interface DatosCliente {
    ValorFecha: string;
    ValorEmpresa: string;
    ValorNit: string;
    ValorTelefono: string;
    Valor: string;
    ValorNombreEquipo: string;
    ValorCodigo: string;
    ValorSeleccion: string;
    ValorModelo: string;
    ValorSerie: string;
    ValorObra: string;
    ValorFabricante: string;
    ValorMarca: string;
    ValorVoltaje: string;
    ValorTipoControl: string;
    ValorAgua: string;
    ValorConsumo: string;
    ValorTipoOperacio: string;
    ValorAire: string;
    ValorPotencia: string;
    ValorCombustible: string;
    ValorRepuestos: string;
    ValorObservaciones: string;
    ValorResponsable: string;
}

export const crearCliente = async (datos: DatosCliente) => {
    try {
        const response = await axiosInstance.post('/endpoint', datos);
        return response.data;
    } catch (error) {
        // Manejo de errores
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data.message ?? 'Error en la solicitud');
        } else {
            throw new Error('Error desconocido');
        }
    }
};