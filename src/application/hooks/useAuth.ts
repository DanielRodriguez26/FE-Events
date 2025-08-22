import { useEffect } from 'react';
import useStore from '@store/store';

// Hook personalizado para manejar la autenticación
// Proporciona métodos convenientes y lógica de autenticación

export const useAuth = () => {
	const store = useStore();
	const {
		// Estado
		user,
		token,
		refreshToken,
		isAuthenticated,
		isLoading,
		error,
		
		// Acciones
		login,
		register,
		logout,
		clearError,
		setLoading,
	} = store;

	// Verificar si el token ha expirado
	const isTokenExpired = (token: string): boolean => {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const currentTime = Date.now() / 1000;
			return payload.exp < currentTime;
		} catch {
			return true;
		}
	};

	// Función para verificar y refrescar token automáticamente
	const checkAndRefreshToken = async (): Promise<boolean> => {
		if (!token || !refreshToken) {
			return false;
		}

		if (isTokenExpired(token)) {
			return await store.refreshTokenAction();
		}

		return true;
	};

	// Efecto para verificar token al montar el componente
	useEffect(() => {
		if (token && refreshToken) {
			checkAndRefreshToken();
		}
	}, []);

	// Función para obtener el token de autorización para peticiones HTTP
	const getAuthHeaders = () => {
		if (!token) return {};
		
		return {
			Authorization: `Bearer ${token}`,
		};
	};

	return {
		// Estado
		user,
		token,
		isAuthenticated,
		isLoading,
		error,
		
		// Acciones
		login,
		register,
		logout,
		clearError,
		setLoading,
		
		// Utilidades
		checkAndRefreshToken,
		getAuthHeaders,
		isTokenExpired,
	};
};
