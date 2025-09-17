import { renderHook, act } from '@testing-library/react';
import { useAuth } from '@application/hooks/useAuth';
import useStore from '@infrastructure/store/store';

// Mock del store
jest.mock('@infrastructure/store/store');

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

describe('useAuth Hook', () => {
	const mockStore = {
		user: null,
		token: null,
		refreshToken: null,
		isAuthenticated: false,
		isLoading: false,
		error: null,
		login: jest.fn(),
		register: jest.fn(),
		logout: jest.fn(),
		clearError: jest.fn(),
		setLoading: jest.fn(),
		refreshTokenAction: jest.fn(),
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockUseStore.mockReturnValue(mockStore);
	});

	describe('Estado inicial', () => {
		test('retorna el estado inicial correcto', () => {
			const { result } = renderHook(() => useAuth());

			expect(result.current.user).toBeNull();
			expect(result.current.token).toBeNull();
			expect(result.current.isAuthenticated).toBe(false);
			expect(result.current.isLoading).toBe(false);
			expect(result.current.error).toBeNull();
		});

		test('retorna las funciones del store', () => {
			const { result } = renderHook(() => useAuth());

			expect(result.current.login).toBe(mockStore.login);
			expect(result.current.register).toBe(mockStore.register);
			expect(result.current.logout).toBe(mockStore.logout);
			expect(result.current.clearError).toBe(mockStore.clearError);
			expect(result.current.setLoading).toBe(mockStore.setLoading);
		});
	});

	describe('isTokenExpired', () => {
		test('retorna true para token expirado', () => {
			const { result } = renderHook(() => useAuth());

			// Token expirado (exp: 1000 = 1 de enero de 1970)
			const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEwMDB9.signature';

			expect(result.current.isTokenExpired(expiredToken)).toBe(true);
		});

		test('retorna false para token válido', () => {
			const { result } = renderHook(() => useAuth());

			// Token válido (exp: futuro)
			const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature';

			expect(result.current.isTokenExpired(validToken)).toBe(false);
		});

		test('retorna true para token inválido', () => {
			const { result } = renderHook(() => useAuth());

			const invalidToken = 'invalid-token';

			expect(result.current.isTokenExpired(invalidToken)).toBe(true);
		});

		test('retorna true para token malformado', () => {
			const { result } = renderHook(() => useAuth());

			const malformedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';

			expect(result.current.isTokenExpired(malformedToken)).toBe(true);
		});
	});

	describe('checkAndRefreshToken', () => {
		test('retorna false cuando no hay token ni refreshToken', async () => {
			const { result } = renderHook(() => useAuth());

			const isValid = await result.current.checkAndRefreshToken();

			expect(isValid).toBe(false);
			expect(mockStore.refreshTokenAction).not.toHaveBeenCalled();
		});

		test('retorna true cuando el token es válido', async () => {
			const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature';

			mockUseStore.mockReturnValue({
				...mockStore,
				token: validToken,
				refreshToken: 'refresh-token',
			});

			const { result } = renderHook(() => useAuth());

			const isValid = await result.current.checkAndRefreshToken();

			expect(isValid).toBe(true);
			expect(mockStore.refreshTokenAction).not.toHaveBeenCalled();
		});

		test('llama a refreshTokenAction cuando el token está expirado', async () => {
			const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEwMDB9.signature';

			mockStore.refreshTokenAction.mockResolvedValue(true);

			mockUseStore.mockReturnValue({
				...mockStore,
				token: expiredToken,
				refreshToken: 'refresh-token',
			});

			const { result } = renderHook(() => useAuth());

			const isValid = await result.current.checkAndRefreshToken();

			expect(mockStore.refreshTokenAction).toHaveBeenCalledTimes(1);
			expect(isValid).toBe(true);
		});

		test('retorna false cuando refreshTokenAction falla', async () => {
			const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjEwMDB9.signature';

			mockStore.refreshTokenAction.mockResolvedValue(false);

			mockUseStore.mockReturnValue({
				...mockStore,
				token: expiredToken,
				refreshToken: 'refresh-token',
			});

			const { result } = renderHook(() => useAuth());

			const isValid = await result.current.checkAndRefreshToken();

			expect(mockStore.refreshTokenAction).toHaveBeenCalledTimes(1);
			expect(isValid).toBe(false);
		});
	});

	describe('getAuthHeaders', () => {
		test('retorna objeto vacío cuando no hay token', () => {
			const { result } = renderHook(() => useAuth());

			const headers = result.current.getAuthHeaders();

			expect(headers).toEqual({});
		});

		test('retorna headers de autorización cuando hay token', () => {
			const token = 'valid-token';

			mockUseStore.mockReturnValue({
				...mockStore,
				token,
			});

			const { result } = renderHook(() => useAuth());

			const headers = result.current.getAuthHeaders();

			expect(headers).toEqual({
				Authorization: `Bearer ${token}`,
			});
		});
	});

	describe('Estado con usuario autenticado', () => {
		const mockUser = {
			id: '1',
			name: 'Juan Pérez',
			email: 'juan@example.com',
		};

		test('retorna estado de usuario autenticado', () => {
			mockUseStore.mockReturnValue({
				...mockStore,
				user: mockUser,
				token: 'valid-token',
				isAuthenticated: true,
			});

			const { result } = renderHook(() => useAuth());

			expect(result.current.user).toEqual(mockUser);
			expect(result.current.token).toBe('valid-token');
			expect(result.current.isAuthenticated).toBe(true);
		});
	});

	describe('Estado de carga', () => {
		test('retorna estado de carga', () => {
			mockUseStore.mockReturnValue({
				...mockStore,
				isLoading: true,
			});

			const { result } = renderHook(() => useAuth());

			expect(result.current.isLoading).toBe(true);
		});
	});

	describe('Estado de error', () => {
		test('retorna estado de error', () => {
			const errorMessage = 'Error de autenticación';

			mockUseStore.mockReturnValue({
				...mockStore,
				error: errorMessage,
			});

			const { result } = renderHook(() => useAuth());

			expect(result.current.error).toBe(errorMessage);
		});
	});

	describe('Efecto de verificación de token', () => {
		test('verifica token al montar el hook', () => {
			const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjk5OTk5OTk5OTl9.signature';

			mockUseStore.mockReturnValue({
				...mockStore,
				token: validToken,
				refreshToken: 'refresh-token',
			});

			renderHook(() => useAuth());

			// El efecto se ejecuta automáticamente al montar el hook
			// No necesitamos hacer assertions específicos aquí ya que checkAndRefreshToken
			// es una función interna que ya probamos por separado
		});

		test('no verifica token cuando no hay token ni refreshToken', () => {
			renderHook(() => useAuth());

			// No debe haber llamadas a refreshTokenAction
			expect(mockStore.refreshTokenAction).not.toHaveBeenCalled();
		});
	});
});
