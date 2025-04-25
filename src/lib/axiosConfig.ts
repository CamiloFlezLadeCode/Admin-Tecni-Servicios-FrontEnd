import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://tu-api.com', // Cambia esto por la URL base de tu API
    headers: {
        'Content-Type': 'application/json',
        // Puedes agregar más encabezados si es necesario
    },
});

export default axiosInstance;
