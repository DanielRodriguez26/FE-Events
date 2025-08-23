import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '@/application/pages/profile/Profile';
import useStore from '@store/store';

// Mock del store
jest.mock('@store/store');

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

// Mock de react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Profile Component', () => {
  const mockUser = {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '+573001234567',
    created_at: '2024-01-01T00:00:00Z'
  };

  const mockStore = {
    user: mockUser,
    token: 'mock-token',
    isAuthenticated: true
  };

  beforeEach(() => {
    mockUseStore.mockReturnValue(mockStore);
    mockNavigate.mockClear();
  });

  it('renders profile information correctly', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Verificar que se muestre la información del usuario
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    expect(screen.getByText('+573001234567')).toBeInTheDocument();
    expect(screen.getByText('1/1/2024')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Verificar que se muestre el estado de carga
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('displays user events after loading', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    // Esperar a que se carguen los eventos
    await waitFor(() => {
      expect(screen.getByText('Conferencia de Tecnología 2024')).toBeInTheDocument();
    });

    // Verificar que se muestren los eventos del usuario
    expect(screen.getByText('Workshop de React')).toBeInTheDocument();
    expect(screen.getByText('Meetup de Desarrollo Web')).toBeInTheDocument();
  });

  it('shows correct event status badges', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Inscrito')).toBeInTheDocument();
      expect(screen.getByText('Asistió')).toBeInTheDocument();
    });
  });

  it('navigates to event details when clicking "Ver Detalles"', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      const detailButtons = screen.getAllByText('Ver Detalles');
      fireEvent.click(detailButtons[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/event/1');
  });

  it('navigates to event registration when clicking "Gestionar Inscripción"', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      const manageButtons = screen.getAllByText('Gestionar Inscripción');
      fireEvent.click(manageButtons[0]);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/events/register/1');
  });

  it('shows empty state when user has no events', async () => {
    // Mock de eventos vacíos
    const mockEmptyStore = {
      ...mockStore,
      userEvents: []
    };

    mockUseStore.mockReturnValue(mockEmptyStore);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No tienes eventos registrados')).toBeInTheDocument();
    });
  });

  it('navigates to events page when clicking "Explorar Eventos"', async () => {
    // Mock de eventos vacíos
    const mockEmptyStore = {
      ...mockStore,
      userEvents: []
    };

    mockUseStore.mockReturnValue(mockEmptyStore);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      const exploreButton = screen.getByText('Explorar Eventos');
      fireEvent.click(exploreButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/events');
  });

  it('handles logout correctly', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      const logoutButton = screen.getByText('Cerrar Sesión');
      fireEvent.click(logoutButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to profile edit when clicking "Editar Perfil"', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      const editButton = screen.getByText('Editar Perfil');
      fireEvent.click(editButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/profile/edit');
  });

  it('redirects to login if not authenticated', () => {
    const mockUnauthenticatedStore = {
      ...mockStore,
      isAuthenticated: false,
      token: null
    };

    mockUseStore.mockReturnValue(mockUnauthenticatedStore);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('displays correct statistics', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Verificar estadísticas
      expect(screen.getByText('3')).toBeInTheDocument(); // Total eventos
      expect(screen.getByText('1')).toBeInTheDocument(); // Eventos asistidos
      expect(screen.getByText('2')).toBeInTheDocument(); // Próximos eventos
    });
  });

  it('handles error state correctly', async () => {
    // Mock de error
    const mockErrorStore = {
      ...mockStore,
      error: 'Error al cargar los eventos del usuario'
    };

    mockUseStore.mockReturnValue(mockErrorStore);

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error al cargar los eventos del usuario')).toBeInTheDocument();
    });
  });
});
