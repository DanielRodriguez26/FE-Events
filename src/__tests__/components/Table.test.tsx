import { render, screen, fireEvent } from '@testing-library/react';
import Table from '@/components/table/Table';
import type { IEventDto } from '@domain/home/home.interface';

// Mock del componente Paginator
jest.mock('@components/Paginator/Paginator', () => {
	return function MockPaginator() {
		return <div data-testid='paginator'>Paginator</div>;
	};
});

const mockEvents: IEventDto[] = [
	{
		id: 1,
		title: 'Conferencia de Tecnología',
		description: 'Una conferencia sobre las últimas tendencias tecnológicas',
		start_date: '2024-01-15T10:00:00Z',
		end_date: '2024-01-15T18:00:00Z',
		location: 'Centro de Convenciones',
		capacity: 200,
		price: 50,
		category: 'Tecnología',
		organizer: 'Tech Events Inc.',
		image_url: 'https://example.com/image1.jpg',
		is_favorite: false,
	},
	{
		id: 2,
		title: 'Workshop de Marketing Digital',
		description: 'Aprende estrategias de marketing digital',
		start_date: '2024-01-20T14:00:00Z',
		end_date: '2024-01-20T17:00:00Z',
		location: 'Hotel Plaza',
		capacity: 50,
		price: 25,
		category: 'Marketing',
		organizer: 'Marketing Pro',
		image_url: 'https://example.com/image2.jpg',
		is_favorite: true,
	},
];

describe('Table Component', () => {
	const mockOnEventClick = jest.fn();
	const mockOnFavoriteClick = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Estado de carga', () => {
		test('muestra el estado de carga cuando isLoading es true', () => {
			render(
				<Table events={null} isLoading={true} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />
			);

			expect(screen.getByText('Cargando eventos...')).toBeInTheDocument();
			expect(screen.getByText('Por favor espera un momento')).toBeInTheDocument();
			expect(screen.getByRole('generic')).toHaveClass('animate-spin');
		});
	});

	describe('Estado de error', () => {
		test('muestra el estado de error cuando hay un error', () => {
			const errorMessage = 'Error al conectar con el servidor';

			render(
				<Table events={null} error={errorMessage} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />
			);

			expect(screen.getByText('Error al cargar eventos')).toBeInTheDocument();
			expect(screen.getByText(errorMessage)).toBeInTheDocument();
		});
	});

	describe('Estado sin eventos', () => {
		test('muestra mensaje cuando no hay eventos', () => {
			render(<Table events={[]} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			expect(screen.getByText('No hay eventos disponibles')).toBeInTheDocument();
			expect(screen.getByText('Por el momento no se encontraron eventos. Vuelve más tarde.')).toBeInTheDocument();
		});

		test('muestra mensaje cuando events es null', () => {
			render(<Table events={null} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			expect(screen.getByText('No hay eventos disponibles')).toBeInTheDocument();
		});
	});

	describe('Renderizado de tabla con eventos', () => {
		test('renderiza la tabla correctamente con eventos', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			// Verificar encabezados de tabla
			expect(screen.getByText('Nombre')).toBeInTheDocument();
			expect(screen.getByText('Fecha')).toBeInTheDocument();
			expect(screen.getByText('Ubicación')).toBeInTheDocument();
			expect(screen.getByText('Acciones')).toBeInTheDocument();

			// Verificar datos de eventos
			expect(screen.getByText('Conferencia de Tecnología')).toBeInTheDocument();
			expect(screen.getByText('Workshop de Marketing Digital')).toBeInTheDocument();
			expect(screen.getByText('Centro de Convenciones')).toBeInTheDocument();
			expect(screen.getByText('Hotel Plaza')).toBeInTheDocument();

			// Verificar que se renderiza el paginador
			expect(screen.getByTestId('paginator')).toBeInTheDocument();
		});

		test('formatea las fechas correctamente', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			// Verificar que las fechas se formatean correctamente
			// El formato exacto dependerá de la configuración regional del navegador
			const dateElements = screen.getAllByText(/\d{1,2}\/\d{1,2}\/\d{4}/);
			expect(dateElements.length).toBeGreaterThan(0);
		});

		test('renderiza botones de acción para cada evento', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			const verDetallesButtons = screen.getAllByText('Ver detalles');
			expect(verDetallesButtons).toHaveLength(2);
		});
	});

	describe('Interacciones de usuario', () => {
		test('llama a onEventClick cuando se hace clic en Ver detalles', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			const verDetallesButtons = screen.getAllByText('Ver detalles');
			fireEvent.click(verDetallesButtons[0]);

			expect(mockOnEventClick).toHaveBeenCalledTimes(1);
			expect(mockOnEventClick).toHaveBeenCalledWith(mockEvents[0]);
		});

		test('llama a onFavoriteClick cuando se hace clic en el botón de favorito', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			const favoriteButtons = screen.getAllByRole('button').filter(button => button.textContent === '');

			fireEvent.click(favoriteButtons[0]);

			expect(mockOnFavoriteClick).toHaveBeenCalledTimes(1);
			expect(mockOnFavoriteClick).toHaveBeenCalledWith(mockEvents[0]);
		});

		test('no llama a las funciones callback cuando no están definidas', () => {
			render(<Table events={mockEvents} />);

			const verDetallesButtons = screen.getAllByText('Ver detalles');
			const favoriteButtons = screen.getAllByRole('button').filter(button => button.textContent === '');

			fireEvent.click(verDetallesButtons[0]);
			fireEvent.click(favoriteButtons[0]);

			// No debe haber errores en la consola
			expect(mockOnEventClick).not.toHaveBeenCalled();
			expect(mockOnFavoriteClick).not.toHaveBeenCalled();
		});
	});

	describe('Accesibilidad', () => {
		test('tiene estructura de tabla accesible', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			const table = screen.getByRole('table');
			expect(table).toBeInTheDocument();

			const headers = screen.getAllByRole('columnheader');
			expect(headers).toHaveLength(4);

			const rows = screen.getAllByRole('row');
			expect(rows.length).toBeGreaterThan(1); // header + data rows
		});

		test('botones tienen roles accesibles', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			const buttons = screen.getAllByRole('button');
			expect(buttons.length).toBeGreaterThan(0);

			buttons.forEach(button => {
				expect(button).toBeInTheDocument();
			});
		});
	});

	describe('Estilos y clases CSS', () => {
		test('aplica clases CSS correctas', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			const tableContainer = screen.getByRole('table').closest('div');
			expect(tableContainer).toHaveClass('relative', 'flex', 'flex-col', 'w-full', 'h-full', 'overflow-scroll');
		});

		test('aplica hover effect en las filas', () => {
			render(<Table events={mockEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			const rows = screen.getAllByRole('row').slice(1); // Excluir header
			rows.forEach(row => {
				expect(row).toHaveClass('hover:bg-slate-50');
			});
		});
	});

	describe('Casos edge', () => {
		test('maneja eventos con datos incompletos', () => {
			const incompleteEvents: IEventDto[] = [
				{
					id: 1,
					title: 'Evento sin descripción',
					description: '',
					start_date: '2024-01-15T10:00:00Z',
					end_date: '2024-01-15T18:00:00Z',
					location: '',
					capacity: 0,
					price: 0,
					category: '',
					organizer: '',
					image_url: '',
					is_favorite: false,
				},
			];

			render(<Table events={incompleteEvents} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />);

			expect(screen.getByText('Evento sin descripción')).toBeInTheDocument();
			expect(screen.getByText('')).toBeInTheDocument(); // location vacía
		});

		test('maneja fechas inválidas', () => {
			const eventsWithInvalidDate: IEventDto[] = [
				{
					...mockEvents[0],
					start_date: 'invalid-date',
				},
			];

			render(
				<Table events={eventsWithInvalidDate} onEventClick={mockOnEventClick} onFavoriteClick={mockOnFavoriteClick} />
			);

			// Debe renderizar sin errores
			expect(screen.getByText('Conferencia de Tecnología')).toBeInTheDocument();
		});
	});
});
