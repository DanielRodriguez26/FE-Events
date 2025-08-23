import { BACKEND_ENDPOINTS } from "../settings/backend.config";
import { get } from "../settings/http.service";
import type { ISpeakerDto } from "./speaker.interface";

const getAllSpeakers = async (): Promise<ISpeakerDto[]> => {
    try {
		// Realiza la petición GET al endpoint de ponentes
		const res = get<ISpeakerDto[]>({
			url:'', // Agregar parámetros de paginación
			baseURL: BACKEND_ENDPOINTS.speakers, // Usamos la URL completa del backend
		});

		// Espera la respuesta
		const json = await res;
		console.log('✅ Ponentes cargados exitosamente:', json);
		return json;
	} catch (error) {
		console.error('❌ Error al cargar ponentes:', error);
		throw error;
	}
};


const speakerServices = {
    getAllSpeakers,
}

export { speakerServices };