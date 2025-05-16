import axios from 'axios';
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const GuardarBackUp = async () => {
    try {
        const { data } = await axios.post(`${apiUrl}/crear-backup`);
        return data;
    } catch (error) {
        console.log("Error al guardar BackUp");
        throw error;
    }
};
export default GuardarBackUp;