import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useAuth } from '@application/hooks';
import Navbar from '@/components/navbar/Navbar';

// Mock del hook useAuth
jest.mock('@application/hooks', () => ({
  useAuth: jest.fn(),
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Wrapper para el router
const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Usuario no autenticado', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
      });
    });

    test('renderiza correctamente con usuario no autenticado', () => {
      renderWithRouter(<Navbar />);
      
      expect(screen.getByText('MisEventos')).toBeInTheDocument();
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Eventos')).toBeInTheDocument();
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
      expect(screen.getByText('Registrarse')).toBeInTheDocument();
      
      // No debe mostrar elementos de usuario autenticado
      expect(screen.queryByText('Crear Evento')).not.toBeInTheDocument();
      expect(screen.queryByText('Perfil')).not.toBeInTheDocument();
      expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
    });

    test('navega correctamente a las rutas principales', () => {
      renderWithRouter(<Navbar />);
      
      const inicioLink = screen.getByText('Inicio').closest('a');
      const eventosLink = screen.getByText('Eventos').closest('a');
      const loginLink = screen.getByText('Iniciar Sesión').closest('a');
      const registerLink = screen.getByText('Registrarse').closest('a');
      
      expect(inicioLink).toHaveAttribute('href', '/');
      expect(eventosLink).toHaveAttribute('href', '/eventos');
      expect(loginLink).toHaveAttribute('href', '/login');
      expect(registerLink).toHaveAttribute('href', '/register');
    });
  });

  describe('Usuario autenticado', () => {
    const mockUser = {
      id: '1',
      name: 'Juan Pérez',
      email: 'juan@example.com',
    };

    const mockLogout = jest.fn();

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        login: jest.fn(),
        logout: mockLogout,
        register: jest.fn(),
      });
    });

    test('renderiza correctamente con usuario autenticado', () => {
      renderWithRouter(<Navbar />);
      
      expect(screen.getByText('MisEventos')).toBeInTheDocument();
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Eventos')).toBeInTheDocument();
      expect(screen.getByText('Crear Evento')).toBeInTheDocument();
      expect(screen.getByText('Perfil')).toBeInTheDocument();
      expect(screen.getByText('Hola, Juan Pérez')).toBeInTheDocument();
      expect(screen.getByText('Cerrar Sesión')).toBeInTheDocument();
      
      // No debe mostrar elementos de usuario no autenticado
      expect(screen.queryByText('Iniciar Sesión')).not.toBeInTheDocument();
      expect(screen.queryByText('Registrarse')).not.toBeInTheDocument();
    });

    test('muestra nombre de usuario por defecto cuando no hay nombre', () => {
      mockUseAuth.mockReturnValue({
        user: { ...mockUser, name: undefined },
        isAuthenticated: true,
        login: jest.fn(),
        logout: mockLogout,
        register: jest.fn(),
      });

      renderWithRouter(<Navbar />);
      
      expect(screen.getByText('Hola, Usuario')).toBeInTheDocument();
    });

    test('ejecuta logout al hacer clic en Cerrar Sesión', async () => {
      renderWithRouter(<Navbar />);
      
      const logoutButton = screen.getByText('Cerrar Sesión');
      fireEvent.click(logoutButton);
      
      await waitFor(() => {
        expect(mockLogout).toHaveBeenCalledTimes(1);
      });
    });

    test('navega correctamente a las rutas de usuario autenticado', () => {
      renderWithRouter(<Navbar />);
      
      const crearEventoLink = screen.getByText('Crear Evento').closest('a');
      const perfilLink = screen.getByText('Perfil').closest('a');
      
      expect(crearEventoLink).toHaveAttribute('href', '/crear-evento');
      expect(perfilLink).toHaveAttribute('href', '/perfil');
    });
  });

  describe('Menú móvil', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
      });
    });

    test('abre y cierra el menú móvil correctamente', () => {
      renderWithRouter(<Navbar />);
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      
      // Menú inicialmente cerrado
      expect(screen.queryByText('Inicio')).toBeInTheDocument(); // En desktop
      expect(screen.queryByText('Eventos')).toBeInTheDocument(); // En desktop
      
      // Abrir menú
      fireEvent.click(menuButton);
      
      // Verificar que el menú móvil se muestra
      const mobileMenu = screen.getByText('Inicio').closest('div');
      expect(mobileMenu).toBeInTheDocument();
      
      // Cerrar menú
      fireEvent.click(menuButton);
      
      // Verificar que el menú móvil se oculta
      expect(screen.queryByText('Inicio')).toBeInTheDocument(); // Solo desktop
    });

    test('cierra el menú móvil al hacer clic en un enlace', () => {
      renderWithRouter(<Navbar />);
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);
      
      const inicioLink = screen.getAllByText('Inicio')[1]; // El segundo es el del menú móvil
      fireEvent.click(inicioLink);
      
      // El menú debe cerrarse automáticamente
      expect(screen.queryByText('Inicio')).toBeInTheDocument(); // Solo desktop
    });
  });

  describe('Logo y marca', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
      });
    });

    test('renderiza el logo y la marca correctamente', () => {
      renderWithRouter(<Navbar />);
      
      const logo = screen.getByAltText('MisEventos Logo');
      const brandText = screen.getByText('MisEventos');
      
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute('src', '/vite.svg');
      expect(brandText).toBeInTheDocument();
      
      const brandLink = brandText.closest('a');
      expect(brandLink).toHaveAttribute('href', '/');
    });
  });

  describe('Accesibilidad', () => {
    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: null,
        isAuthenticated: false,
        login: jest.fn(),
        logout: jest.fn(),
        register: jest.fn(),
      });
    });

    test('tiene elementos de navegación accesibles', () => {
      renderWithRouter(<Navbar />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
      
      const links = screen.getAllByRole('link');
      expect(links.length).toBeGreaterThan(0);
      
      links.forEach(link => {
        expect(link).toHaveAttribute('href');
      });
    });

    test('botón de menú móvil es accesible', () => {
      renderWithRouter(<Navbar />);
      
      const menuButton = screen.getByRole('button');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-label', 'menu');
    });
  });
});
