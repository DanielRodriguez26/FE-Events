/* eslint-disable @typescript-eslint/no-explicit-any */

// #region Interfaces

// Interfaz para la configuración de los métodos HTTP (axios)
// Define la estructura de parámetros para realizar peticiones HTTP
/** Interface para la configuración de los métodos axios. */
interface ISettingsService {
	/** Ruta del Endpoint. */
	url: string; // URL del endpoint al que se realizará la petición
	/** Mostrar el loading, por defecto es true. */
	loading?: boolean; // Controla si se muestra un indicador de carga
	/** Cuerpo del servicio. */
	payload?: any; // Datos que se enviarán en el cuerpo de la petición
	/** Encriptar la información del payload. */
	encrypt?: boolean; // Indica si los datos deben ser encriptados antes del envío
	/** Mostrar mensajes de error. */
	showMessageReject?: boolean; // Controla si se muestran mensajes de error automáticamente
	/** Configuraciones generales del axios. */
	options?: {
		headers?: Record<string, string | number | boolean>; // Headers personalizados para la petición
		params?: any; // Parámetros de consulta (query parameters)
	};
	/** Cancelar la petición anterior. */
	cancel?: boolean; // Permite cancelar peticiones anteriores si se hace una nueva
	baseURL?: string; // URL base para la petición (opcional)
}

// Interfaz para manejar errores del servidor
// Define la estructura de los errores que pueden retornar las APIs
interface IServerError {
	Code?: string; // Código de error del servidor
	Title?: string; // Título descriptivo del error
	Message?: string; // Mensaje detallado del error
	StatusCode?: number; // Código de estado HTTP (200, 400, 500, etc.)
	Type?: 'warning' | 'info' | 'error' | 'success'; // Tipo de mensaje para mostrar en la UI
}

// #endregion

export type { ISettingsService, IServerError };
