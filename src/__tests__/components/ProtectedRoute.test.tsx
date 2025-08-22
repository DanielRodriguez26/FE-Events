import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { useAuth } from '@application/hooks';
import ProtectedRoute from '@components/common/ProtectedRoute';

// Mock del hook useAuth
jest.mock('@application/hooks', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock de react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: ({ to, state, replace }: any) => (
    <div data-testid="navigate" data-to={to} data-state={JSON.stringify(state)} data-replace={replace}>
      Navigate to {to}
    </div>
  ),
  useLocation: () => ({ pathname: '/protected', search: '', hash: '', state: null }),
}));

const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

describe('ProtectedRoute Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Estado de carga', () => {
    test('muestra loading cuando isLoading es true', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByRole('generic')).toHaveClass('animate-spin');
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('Rutas que requieren autenticación', () => {
    test('redirige a login cuando usuario no está autenticado', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toBeInTheDocument();
      expect(navigateElement).toHaveAttribute('data-to', '/login');
      expect(navigateElement).toHaveAttribute('data-replace', 'true');
      
      const state = JSON.parse(navigateElement.getAttribute('data-state') || '{}');
      expect(state.from.pathname).toBe('/protected');
    });

    test('redirige a ruta personalizada cuando se especifica redirectTo', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute redirectTo="/custom-login">
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toHaveAttribute('data-to', '/custom-login');
    });

    test('renderiza contenido cuando usuario está autenticado', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'valid-token',
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Rutas que no requieren autenticación', () => {
    test('redirige a home cuando usuario autenticado accede a ruta pública', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'valid-token',
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute requireAuth={false}>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toBeInTheDocument();
      expect(navigateElement).toHaveAttribute('data-to', '/');
      expect(navigateElement).toHaveAttribute('data-replace', 'true');
    });

    test('renderiza contenido cuando usuario no autenticado accede a ruta pública', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute requireAuth={false}>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
      expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
    });
  });

  describe('Preservación del estado de navegación', () => {
    test('preserva la ubicación actual en el estado de navegación', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const navigateElement = screen.getByTestId('navigate');
      const state = JSON.parse(navigateElement.getAttribute('data-state') || '{}');
      
      expect(state.from).toEqual({
        pathname: '/protected',
        search: '',
        hash: '',
        state: null,
      });
    });
  });

  describe('Casos edge', () => {
    test('maneja transición de loading a autenticado', () => {
      const { rerender } = render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      // Estado inicial: loading
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      rerender(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByRole('generic')).toHaveClass('animate-spin');

      // Estado final: autenticado
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false,
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        token: 'valid-token',
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      rerender(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    test('maneja transición de loading a no autenticado', () => {
      const { rerender } = render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      // Estado inicial: loading
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      rerender(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      expect(screen.getByRole('generic')).toHaveClass('animate-spin');

      // Estado final: no autenticado
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      rerender(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toBeInTheDocument();
      expect(navigateElement).toHaveAttribute('data-to', '/login');
    });
  });

  describe('Accesibilidad', () => {
    test('loading spinner es accesible', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const spinner = screen.getByRole('generic');
      expect(spinner).toHaveClass('animate-spin');
    });
  });

  describe('Props por defecto', () => {
    test('usa valores por defecto cuando no se proporcionan props', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        token: null,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
        clearError: jest.fn(),
        setLoading: jest.fn(),
        checkAndRefreshToken: jest.fn(),
        getAuthHeaders: jest.fn(),
        isTokenExpired: jest.fn(),
      });

      render(
        <BrowserRouter>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </BrowserRouter>
      );

      const navigateElement = screen.getByTestId('navigate');
      expect(navigateElement).toHaveAttribute('data-to', '/login'); // valor por defecto
    });
  });
});
