# Pruebas Unitarias - MisEventos Frontend

Este directorio contiene todas las pruebas unitarias del proyecto MisEventos Frontend.

## Estructura de Pruebas

```
src/__tests__/
├── components/           # Pruebas de componentes React
│   ├── Navbar.test.tsx
│   ├── Table.test.tsx
│   └── ProtectedRoute.test.tsx
├── hooks/               # Pruebas de hooks personalizados
│   └── useAuth.test.ts
├── domain/              # Pruebas de servicios y lógica de dominio
│   └── auth.service.test.ts
├── setup.ts             # Configuración global de pruebas
├── __mocks__/           # Mocks globales
│   └── fileMock.js
└── README.md            # Esta documentación
```

## Configuración

### Dependencias

Las siguientes dependencias están configuradas para las pruebas:

- **Jest**: Framework de pruebas
- **React Testing Library**: Utilidades para probar componentes React
- **@testing-library/jest-dom**: Matchers adicionales para Jest
- **@testing-library/user-event**: Simulación de eventos de usuario
- **jest-environment-jsdom**: Entorno de pruebas para DOM

### Configuración de Jest

El archivo `jest.config.ts` contiene la configuración completa de Jest:

- **Preset**: `ts-jest` para soporte de TypeScript
- **Environment**: `jsdom` para simular el navegador
- **Setup**: Archivo de configuración global en `setup.ts`
- **Module Mapping**: Mapeo de alias y archivos estáticos
- **Coverage**: Configuración de cobertura de código

## Comandos de Pruebas

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:coverage
```

## Convenciones de Pruebas

### Estructura de Archivos de Prueba

Cada archivo de prueba sigue esta estructura:

```typescript


import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from '@path/to/component';

// Mocks
jest.mock('@path/to/dependency');

describe('ComponentName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Funcionalidad específica', () => {
    test('descripción del test', () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### Nomenclatura

- **Archivos**: `ComponentName.test.tsx` o `ComponentName.test.ts`
- **Describe blocks**: Nombre del componente o funcionalidad
- **Tests**: Descripción clara de lo que se está probando
- **Variables**: Prefijo `mock` para datos simulados

### Patrones de Prueba

#### 1. Pruebas de Componentes

```typescript
// Renderizado básico
test('renderiza correctamente', () => {
  render(<Component />);
  expect(screen.getByText('Texto esperado')).toBeInTheDocument();
});

// Interacciones de usuario
test('maneja clics correctamente', () => {
  const mockHandler = jest.fn();
  render(<Component onClick={mockHandler} />);
  
  fireEvent.click(screen.getByRole('button'));
  expect(mockHandler).toHaveBeenCalledTimes(1);
});

// Estados condicionales
test('muestra loading cuando isLoading es true', () => {
  render(<Component isLoading={true} />);
  expect(screen.getByText('Cargando...')).toBeInTheDocument();
});
```

#### 2. Pruebas de Hooks

```typescript
import { renderHook } from '@testing-library/react';

test('retorna estado inicial correcto', () => {
  const { result } = renderHook(() => useCustomHook());
  expect(result.current.value).toBe(expectedValue);
});
```

#### 3. Pruebas de Servicios

```typescript
// Mock de dependencias
jest.mock('@domain/settings/http.service');

test('llama al servicio correctamente', async () => {
  mockService.mockResolvedValue(mockResponse);
  
  const result = await serviceFunction(params);
  
  expect(mockService).toHaveBeenCalledWith(expectedParams);
  expect(result).toEqual(expectedResponse);
});
```

## Mocks y Stubs

### Mocks Globales

- **Archivos estáticos**: Mocked en `__mocks__/fileMock.js`
- **Console**: Spied en pruebas que requieren logging
- **Window APIs**: Mocked en `setup.ts`

### Mocks Específicos

```typescript
// Mock de hooks
jest.mock('@application/hooks', () => ({
  useAuth: jest.fn(),
}));

// Mock de servicios
jest.mock('@domain/settings/http.service', () => ({
  post: jest.fn(),
}));

// Mock de componentes
jest.mock('@components/Paginator/Paginator', () => {
  return function MockPaginator() {
    return <div data-testid="paginator">Paginator</div>;
  };
});
```

## Cobertura de Pruebas

### Métricas de Cobertura

- **Statements**: Porcentaje de líneas ejecutadas
- **Branches**: Porcentaje de ramas condicionales cubiertas
- **Functions**: Porcentaje de funciones ejecutadas
- **Lines**: Porcentaje de líneas de código ejecutadas

### Configuración de Cobertura

```typescript
collectCoverageFrom: [
  'src/**/*.{js,jsx,ts,tsx}',
  '!src/**/*.d.ts',
  '!src/main.tsx',
  '!src/vite-env.d.ts',
  '!src/**/index.ts',
],
```

## Mejores Prácticas

### 1. Organización

- Agrupa pruebas relacionadas en `describe` blocks
- Usa nombres descriptivos para los tests
- Mantén las pruebas independientes entre sí

### 2. Mocks

- Mock solo lo necesario
- Usa `jest.clearAllMocks()` en `beforeEach`
- Documenta mocks complejos

### 3. Assertions

- Una assertion por test cuando sea posible
- Usa matchers específicos de Testing Library
- Verifica comportamiento, no implementación

### 4. Accesibilidad

- Usa queries accesibles (`getByRole`, `getByLabelText`)
- Prueba navegación por teclado
- Verifica roles y atributos ARIA

### 5. Casos Edge

- Prueba estados de error
- Prueba datos vacíos o inválidos
- Prueba transiciones de estado

## Debugging

### Modo Debug

```bash
# Ejecutar una prueba específica en modo debug
npm test -- --runInBand --no-cache --verbose ComponentName.test.tsx
```

### Console Logs

```typescript
// Habilitar logs en pruebas
beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### React Testing Library Debug

```typescript
// Mostrar el DOM renderizado
screen.debug();

// Mostrar un elemento específico
screen.debug(screen.getByRole('button'));
```

## Integración Continua

### GitHub Actions

Las pruebas se ejecutan automáticamente en:

- Push a cualquier rama
- Pull requests
- Tags

### Configuración CI

```yaml
- name: Run tests
  run: npm run test:coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Recursos Adicionales

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Matchers](https://jestjs.io/docs/expect)
