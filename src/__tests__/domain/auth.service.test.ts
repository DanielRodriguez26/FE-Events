import { loginUser, registerUser, refreshUserToken, logoutUser } from '@domain/auth/auth.service';
import { post } from '@domain/settings/http.service';
import { BACKEND_ENDPOINTS } from '@domain/settings/backend.config';
import type { ILoginCredentials, IRegisterCredentials, IAuthResponse } from '@domain/auth/auth.interface';

// Mock del servicio HTTP
jest.mock('@domain/settings/http.service', () => ({
  post: jest.fn(),
}));

// Mock de la configuración del backend
jest.mock('@domain/settings/backend.config', () => ({
  BACKEND_ENDPOINTS: {
    login: 'http://localhost:3000/auth/login',
    register: 'http://localhost:3000/auth/register',
    refresh: 'http://localhost:3000/auth/refresh',
    logout: 'http://localhost:3000/auth/logout',
  },
}));

const mockPost = post as jest.MockedFunction<typeof post>;

describe('Auth Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('loginUser', () => {
    const mockCredentials: ILoginCredentials = {
      username: 'testuser',
      password: 'password123',
    };

    const mockAuthResponse: IAuthResponse = {
      user: {
        id: '1',
        name: 'Test User',
        username: 'testuser',
      },
      token: 'access-token',
      refreshToken: 'refresh-token',
    };

    test('inicia sesión correctamente con credenciales válidas', async () => {
      mockPost.mockResolvedValue(mockAuthResponse);

      const result = await loginUser(mockCredentials);

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.login,
        payload: mockCredentials,
      });
      expect(result).toEqual(mockAuthResponse);
      expect(console.log).toHaveBeenCalledWith('🔍 Intentando iniciar sesión con:', mockCredentials);
    });

    test('lanza error cuando las credenciales son inválidas', async () => {
      const error = new Error('Invalid credentials');
      mockPost.mockRejectedValue(error);

      await expect(loginUser(mockCredentials)).rejects.toThrow('Credenciales inválidas');

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.login,
        payload: mockCredentials,
      });
      expect(console.error).toHaveBeenCalledWith('Error en login:', error);
    });

    test('maneja errores de red', async () => {
      const networkError = new Error('Network error');
      mockPost.mockRejectedValue(networkError);

      await expect(loginUser(mockCredentials)).rejects.toThrow('Credenciales inválidas');

      expect(console.error).toHaveBeenCalledWith('Error en login:', networkError);
    });
  });

  describe('registerUser', () => {
    const mockCredentials: IRegisterCredentials = {
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      email: 'test@example.com',
      phone: '123456789',
      password: 'password123',
      confirm_password: 'password123',
      is_active: true,
      role_id: 1,
    };

    const mockAuthResponse: IAuthResponse = {
      user: {
        id: '1',
        name: 'Test User',
        username: 'testuser',
      },
      token: 'access-token',
      refreshToken: 'refresh-token',
    };

    test('registra usuario correctamente con datos válidos', async () => {
      mockPost.mockResolvedValue(mockAuthResponse);

      const result = await registerUser(mockCredentials);

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.register,
        payload: mockCredentials,
      });
      expect(result).toEqual(mockAuthResponse);
      expect(console.log).toHaveBeenCalledWith('🔍 Intentando iniciar sesión con:', mockCredentials);
    });

    test('lanza error cuando el registro falla', async () => {
      const error = new Error('Email already exists');
      mockPost.mockRejectedValue(error);

      await expect(registerUser(mockCredentials)).rejects.toThrow('Error al registrar usuario');

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.register,
        payload: mockCredentials,
      });
      expect(console.error).toHaveBeenCalledWith('Error en registro:', error);
    });

    test('maneja errores de validación', async () => {
      const validationError = new Error('Validation failed');
      mockPost.mockRejectedValue(validationError);

      await expect(registerUser(mockCredentials)).rejects.toThrow('Error al registrar usuario');

      expect(console.error).toHaveBeenCalledWith('Error en registro:', validationError);
    });
  });

  describe('refreshUserToken', () => {
    const mockRefreshToken = 'refresh-token-123';
    const mockAuthResponse: IAuthResponse = {
      user: {
        id: '1',
        name: 'Test User',
        username: 'testuser',
      },
      token: 'new-access-token',
      refreshToken: 'new-refresh-token',
    };

    test('refresca el token correctamente', async () => {
      mockPost.mockResolvedValue(mockAuthResponse);

      const result = await refreshUserToken(mockRefreshToken);

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.refresh,
        payload: { refreshToken: mockRefreshToken },
      });
      expect(result).toEqual(mockAuthResponse);
    });

    test('lanza error cuando el refresh token es inválido', async () => {
      const error = new Error('Invalid refresh token');
      mockPost.mockRejectedValue(error);

      await expect(refreshUserToken(mockRefreshToken)).rejects.toThrow('Token de refresco inválido');

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.refresh,
        payload: { refreshToken: mockRefreshToken },
      });
      expect(console.error).toHaveBeenCalledWith('Error al refrescar token:', error);
    });

    test('lanza error cuando el refresh token ha expirado', async () => {
      const error = new Error('Refresh token expired');
      mockPost.mockRejectedValue(error);

      await expect(refreshUserToken(mockRefreshToken)).rejects.toThrow('Token de refresco inválido');

      expect(console.error).toHaveBeenCalledWith('Error al refrescar token:', error);
    });
  });

  describe('logoutUser', () => {
    const mockToken = 'access-token-123';

    test('cierra sesión correctamente', async () => {
      mockPost.mockResolvedValue({});

      await logoutUser(mockToken);

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.logout,
        payload: {},
        options: {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      });
    });

    test('no lanza error cuando el logout falla en el servidor', async () => {
      const error = new Error('Server error');
      mockPost.mockRejectedValue(error);

      // No debe lanzar error
      await expect(logoutUser(mockToken)).resolves.toBeUndefined();

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.logout,
        payload: {},
        options: {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        },
      });
      expect(console.error).toHaveBeenCalledWith('Error en logout:', error);
    });

    test('maneja errores de red sin lanzar excepción', async () => {
      const networkError = new Error('Network error');
      mockPost.mockRejectedValue(networkError);

      await expect(logoutUser(mockToken)).resolves.toBeUndefined();

      expect(console.error).toHaveBeenCalledWith('Error en logout:', networkError);
    });
  });

  describe('Casos edge y validaciones', () => {
    test('loginUser maneja credenciales vacías', async () => {
      const emptyCredentials: ILoginCredentials = {
        email: '',
        password: '',
      };

      const error = new Error('Empty credentials');
      mockPost.mockRejectedValue(error);

      await expect(loginUser(emptyCredentials)).rejects.toThrow('Credenciales inválidas');
    });

    test('registerUser maneja datos incompletos', async () => {
      const incompleteCredentials: IRegisterCredentials = {
        first_name: '',
        username: 'testuser',
        password: 'password123',
        confirmPassword: 'password123',
      };

      const error = new Error('Name is required');
      mockPost.mockRejectedValue(error);

      await expect(registerUser(incompleteCredentials)).rejects.toThrow('Error al registrar usuario');
    });

    test('refreshUserToken maneja token vacío', async () => {
      const error = new Error('Empty refresh token');
      mockPost.mockRejectedValue(error);

      await expect(refreshUserToken('')).rejects.toThrow('Token de refresco inválido');
    });

    test('logoutUser maneja token vacío', async () => {
      mockPost.mockResolvedValue({});

      await expect(logoutUser('')).resolves.toBeUndefined();

      expect(mockPost).toHaveBeenCalledWith({
        url: '',
        baseURL: BACKEND_ENDPOINTS.logout,
        payload: {},
        options: {
          headers: {
            Authorization: 'Bearer ',
          },
        },
      });
    });
  });

  describe('Logging y debugging', () => {
    test('loginUser registra información de debugging', async () => {
      const credentials: ILoginCredentials = {
        email: 'debug@example.com',
        password: 'debug123',
      };

      mockPost.mockResolvedValue({ user: {}, token: '', refreshToken: '' });

      await loginUser(credentials);

      expect(console.log).toHaveBeenCalledWith('🔍 Intentando iniciar sesión con:', credentials);
    });

    test('registerUser registra información de debugging', async () => {
      const credentials: IRegisterCredentials = {
        first_name: 'Debug',
        last_name: 'User',
        username: 'debuguser',
        email: 'debug@example.com',
        phone: '123456789',
        password: 'debug123',
        confirm_password: 'debug123',
        is_active: true,
        role_id: 1,
      };

      mockPost.mockResolvedValue({ user: {}, token: '', refreshToken: '' });

      await registerUser(credentials);

      expect(console.log).toHaveBeenCalledWith('🔍 Intentando iniciar sesión con:', credentials);
    });

    test('todos los errores se registran en consola', async () => {
      const error = new Error('Test error');
      mockPost.mockRejectedValue(error);

      await expect(loginUser({ username: 'testuser', password: 'test' })).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error en login:', error);

      await expect(registerUser({ first_name: 'Test', last_name: 'User', username: 'testuser', email: 'test@example.com', phone: '123456789', password: 'test', confirm_password: 'test', is_active: true, role_id: 1 })).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error en registro:', error);

      await expect(refreshUserToken('test-token')).rejects.toThrow();
      expect(console.error).toHaveBeenCalledWith('Error al refrescar token:', error);

      await logoutUser('test-token');
      expect(console.error).toHaveBeenCalledWith('Error en logout:', error);
    });
  });
});
