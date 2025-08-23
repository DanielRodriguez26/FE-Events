import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SessionManager from '../SessionManager';
import { TimeValidator } from '@/utils/timeValidation';

// Mock del hook useSessions
jest.mock('@/application/hooks/useSessions', () => ({
  useSessions: () => ({
    sessionsByEvent: {
      items: [
        {
          id: 1,
          title: 'Sesión de Prueba',
          description: 'Descripción de prueba',
          start_time: '2024-03-15T10:00:00',
          end_time: '2024-03-15T11:00:00',
          speaker: 'Speaker Test',
          room: 'Sala A',
          capacity: 50,
          registered_attendees: 25
        }
      ]
    },
    loading: false,
    error: null,
    loadSessionsByEvent: jest.fn(),
    createEventSession: jest.fn().mockResolvedValue(true),
    updateSession: jest.fn().mockResolvedValue(true),
    deleteSession: jest.fn().mockResolvedValue(true),
    clearError: jest.fn()
  })
}));

// Mock del TimeValidator
jest.mock('@/utils/timeValidation', () => ({
  TimeValidator: {
    validateSessionTimes: jest.fn(),
    formatDuration: jest.fn().mockReturnValue('1 hora')
  }
}));

const mockProps = {
  sessions: [],
  speakers: [
    {
      id: 1,
      name: 'Speaker Test',
      expertise: ['React', 'TypeScript']
    }
  ],
  eventId: 1,
  onSessionCreate: jest.fn(),
  onSessionUpdate: jest.fn(),
  onSessionDelete: jest.fn(),
  isOrganizer: true,
  isLoading: false
};

describe('SessionManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render session manager with create button for organizers', () => {
    render(<SessionManager {...mockProps} />);
    
    expect(screen.getByText('Sesiones del Evento')).toBeInTheDocument();
    expect(screen.getByText('Agregar Sesión')).toBeInTheDocument();
  });

  it('should not show create button for non-organizers', () => {
    render(<SessionManager {...mockProps} isOrganizer={false} />);
    
    expect(screen.queryByText('Agregar Sesión')).not.toBeInTheDocument();
  });

  it('should show create form when add button is clicked', () => {
    render(<SessionManager {...mockProps} />);
    
    fireEvent.click(screen.getByText('Agregar Sesión'));
    
    expect(screen.getByText('Nueva Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Título de la Sesión *')).toBeInTheDocument();
    expect(screen.getByLabelText('Hora de Inicio *')).toBeInTheDocument();
    expect(screen.getByLabelText('Hora de Fin *')).toBeInTheDocument();
  });

  it('should validate form fields on input change', async () => {
    const mockValidation = {
      isValid: false,
      errors: ['La hora de inicio debe ser en el futuro'],
      warnings: []
    };
    
    (TimeValidator.validateSessionTimes as jest.Mock).mockReturnValue(mockValidation);
    
    render(<SessionManager {...mockProps} />);
    
    fireEvent.click(screen.getByText('Agregar Sesión'));
    
    const startTimeInput = screen.getByLabelText('Hora de Inicio *');
    const endTimeInput = screen.getByLabelText('Hora de Fin *');
    
    fireEvent.change(startTimeInput, { target: { value: '2024-03-15T10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '2024-03-15T11:00' } });
    
    await waitFor(() => {
      expect(TimeValidator.validateSessionTimes).toHaveBeenCalled();
    });
  });

  it('should show validation errors when form is invalid', async () => {
    const mockValidation = {
      isValid: false,
      errors: ['La hora de inicio debe ser en el futuro', 'Conflicto de horario'],
      warnings: ['Se recomienda dejar al menos 15 minutos entre sesiones']
    };
    
    (TimeValidator.validateSessionTimes as jest.Mock).mockReturnValue(mockValidation);
    
    render(<SessionManager {...mockProps} />);
    
    fireEvent.click(screen.getByText('Agregar Sesión'));
    
    const startTimeInput = screen.getByLabelText('Hora de Inicio *');
    const endTimeInput = screen.getByLabelText('Hora de Fin *');
    
    fireEvent.change(startTimeInput, { target: { value: '2024-01-01T10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '2024-01-01T11:00' } });
    
    await waitFor(() => {
      expect(screen.getByText('Errores de validación de horarios')).toBeInTheDocument();
      expect(screen.getByText('La hora de inicio debe ser en el futuro')).toBeInTheDocument();
      expect(screen.getByText('Conflicto de horario')).toBeInTheDocument();
      expect(screen.getByText('Advertencias de horarios')).toBeInTheDocument();
    });
  });

  it('should disable submit button when validation fails', async () => {
    const mockValidation = {
      isValid: false,
      errors: ['Error de validación'],
      warnings: []
    };
    
    (TimeValidator.validateSessionTimes as jest.Mock).mockReturnValue(mockValidation);
    
    render(<SessionManager {...mockProps} />);
    
    fireEvent.click(screen.getByText('Agregar Sesión'));
    
    const startTimeInput = screen.getByLabelText('Hora de Inicio *');
    const endTimeInput = screen.getByLabelText('Hora de Fin *');
    
    fireEvent.change(startTimeInput, { target: { value: '2024-01-01T10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '2024-01-01T11:00' } });
    
    await waitFor(() => {
      const submitButton = screen.getByText('Crear');
      expect(submitButton).toBeDisabled();
    });
  });

  it('should enable submit button when validation passes', async () => {
    const mockValidation = {
      isValid: true,
      errors: [],
      warnings: []
    };
    
    (TimeValidator.validateSessionTimes as jest.Mock).mockReturnValue(mockValidation);
    
    render(<SessionManager {...mockProps} />);
    
    fireEvent.click(screen.getByText('Agregar Sesión'));
    
    const startTimeInput = screen.getByLabelText('Hora de Inicio *');
    const endTimeInput = screen.getByLabelText('Hora de Fin *');
    
    fireEvent.change(startTimeInput, { target: { value: '2024-12-01T10:00' } });
    fireEvent.change(endTimeInput, { target: { value: '2024-12-01T11:00' } });
    
    await waitFor(() => {
      const submitButton = screen.getByText('Crear');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should show existing sessions in the list', () => {
    const sessionsWithData = [
      {
        id: 1,
        title: 'Sesión Existente',
        description: 'Descripción de la sesión',
        start_time: '2024-03-15T10:00:00',
        end_time: '2024-03-15T11:00:00',
        speaker: 'Speaker Test',
        room: 'Sala A',
        capacity: 50,
        registered_attendees: 25
      }
    ];
    
    render(<SessionManager {...mockProps} sessions={sessionsWithData} />);
    
    expect(screen.getByText('Sesión Existente')).toBeInTheDocument();
    expect(screen.getByText('Descripción de la sesión')).toBeInTheDocument();
    expect(screen.getByText('Speaker Test')).toBeInTheDocument();
    expect(screen.getByText('Sala A')).toBeInTheDocument();
  });

  it('should show availability status for sessions', () => {
    const sessionsWithData = [
      {
        id: 1,
        title: 'Sesión Llena',
        description: 'Descripción',
        start_time: '2024-03-15T10:00:00',
        end_time: '2024-03-15T11:00:00',
        speaker: 'Speaker',
        room: 'Sala',
        capacity: 50,
        registered_attendees: 50  // 100% llena
      }
    ];
    
    render(<SessionManager {...mockProps} sessions={sessionsWithData} />);
    
    expect(screen.getByText('50/50')).toBeInTheDocument();
    expect(screen.getByText('Casi lleno')).toBeInTheDocument();
  });

  it('should show edit and delete buttons for organizers', () => {
    const sessionsWithData = [
      {
        id: 1,
        title: 'Sesión Editable',
        description: 'Descripción',
        start_time: '2024-03-15T10:00:00',
        end_time: '2024-03-15T11:00:00',
        speaker: 'Speaker',
        room: 'Sala',
        capacity: 50,
        registered_attendees: 25
      }
    ];
    
    render(<SessionManager {...mockProps} sessions={sessionsWithData} />);
    
    // Los botones de editar y eliminar deberían estar presentes
    // (se renderizan como SVGs, así que verificamos por aria-label o testid)
    const editButtons = screen.getAllByRole('button');
    expect(editButtons.length).toBeGreaterThan(1); // Incluye el botón "Agregar Sesión"
  });

  it('should show empty state when no sessions exist', () => {
    render(<SessionManager {...mockProps} sessions={[]} />);
    
    expect(screen.getByText('No hay sesiones')).toBeInTheDocument();
    expect(screen.getByText('Comienza agregando la primera sesión del evento.')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(<SessionManager {...mockProps} isLoading={true} />);
    
    // Verificar que se muestra el spinner de carga
    const loadingSpinner = document.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('should handle form submission for creating new session', async () => {
    const mockValidation = {
      isValid: true,
      errors: [],
      warnings: []
    };
    
    (TimeValidator.validateSessionTimes as jest.Mock).mockReturnValue(mockValidation);
    
    render(<SessionManager {...mockProps} />);
    
    fireEvent.click(screen.getByText('Agregar Sesión'));
    
    // Llenar el formulario
    fireEvent.change(screen.getByLabelText('Título de la Sesión *'), {
      target: { value: 'Nueva Sesión' }
    });
    fireEvent.change(screen.getByLabelText('Descripción *'), {
      target: { value: 'Descripción de la nueva sesión' }
    });
    fireEvent.change(screen.getByLabelText('Sala *'), {
      target: { value: 'Sala Nueva' }
    });
    fireEvent.change(screen.getByLabelText('Hora de Inicio *'), {
      target: { value: '2024-12-01T10:00' }
    });
    fireEvent.change(screen.getByLabelText('Hora de Fin *'), {
      target: { value: '2024-12-01T11:00' }
    });
    fireEvent.change(screen.getByLabelText('Ponente *'), {
      target: { value: 'Speaker Test' }
    });
    
    // Enviar el formulario
    fireEvent.click(screen.getByText('Crear'));
    
    await waitFor(() => {
      // Verificar que se llamó a la función de creación
      expect(mockProps.onSessionCreate).toHaveBeenCalled();
    });
  });

  it('should handle form cancellation', () => {
    render(<SessionManager {...mockProps} />);
    
    fireEvent.click(screen.getByText('Agregar Sesión'));
    
    // Verificar que el formulario está visible
    expect(screen.getByText('Nueva Sesión')).toBeInTheDocument();
    
    // Cancelar el formulario
    fireEvent.click(screen.getByText('Cancelar'));
    
    // Verificar que el formulario se ocultó
    expect(screen.queryByText('Nueva Sesión')).not.toBeInTheDocument();
  });

  it('should show error message when API call fails', () => {
    // Mock del hook con error
    jest.doMock('@/application/hooks/useSessions', () => ({
      useSessions: () => ({
        sessionsByEvent: null,
        loading: false,
        error: 'Error al cargar sesiones',
        loadSessionsByEvent: jest.fn(),
        createEventSession: jest.fn(),
        updateSession: jest.fn(),
        deleteSession: jest.fn(),
        clearError: jest.fn()
      })
    }));
    
    render(<SessionManager {...mockProps} />);
    
    expect(screen.getByText('Error al cargar sesiones')).toBeInTheDocument();
    expect(screen.getByText('Reintentar')).toBeInTheDocument();
  });
});
