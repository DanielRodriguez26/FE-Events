import { TimeValidator } from '../timeValidation';

describe('TimeValidator', () => {
  const mockExistingSessions = [
    {
      id: 1,
      title: 'Sesión Existente 1',
      start_time: '2024-03-15T10:00:00',
      end_time: '2024-03-15T11:00:00'
    },
    {
      id: 2,
      title: 'Sesión Existente 2',
      start_time: '2024-03-15T14:00:00',
      end_time: '2024-03-15T15:00:00'
    }
  ];

  const mockEventDates = {
    event_start_date: '2024-03-15T08:00:00',
    event_end_date: '2024-03-15T18:00:00'
  };

  describe('validateSessionTimes', () => {
    it('should validate a valid session', () => {
      const validData = {
        start_time: '2024-03-15T12:00:00',
        end_time: '2024-03-15T13:00:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(validData, mockExistingSessions);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.warnings).toHaveLength(0);
    });

    it('should reject session in the past', () => {
      const pastData = {
        start_time: '2024-01-01T10:00:00',
        end_time: '2024-01-01T11:00:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(pastData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La hora de inicio debe ser en el futuro');
    });

    it('should reject session with end time before start time', () => {
      const invalidData = {
        start_time: '2024-03-15T12:00:00',
        end_time: '2024-03-15T11:00:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(invalidData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La hora de fin debe ser después de la hora de inicio');
    });

    it('should reject session with duration less than 15 minutes', () => {
      const shortData = {
        start_time: '2024-03-15T12:00:00',
        end_time: '2024-03-15T12:10:00', // Solo 10 minutos
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(shortData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La duración mínima de una sesión es de 15 minutos');
    });

    it('should reject session with duration more than 8 hours', () => {
      const longData = {
        start_time: '2024-03-15T08:00:00',
        end_time: '2024-03-15T17:00:00', // 9 horas
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(longData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La duración máxima de una sesión es de 8 horas');
    });

    it('should reject session outside business hours (before 8 AM)', () => {
      const earlyData = {
        start_time: '2024-03-15T06:00:00',
        end_time: '2024-03-15T07:00:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(earlyData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Las sesiones solo pueden programarse entre las 8:00 AM y las 10:00 PM');
    });

    it('should reject session outside business hours (after 10 PM)', () => {
      const lateData = {
        start_time: '2024-03-15T22:30:00',
        end_time: '2024-03-15T23:30:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(lateData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Las sesiones solo pueden programarse entre las 8:00 AM y las 10:00 PM');
    });

    it('should reject session that crosses midnight', () => {
      const midnightData = {
        start_time: '2024-03-15T23:00:00',
        end_time: '2024-03-16T01:00:00', // Cruza la medianoche
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(midnightData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Las sesiones no pueden cruzar la medianoche');
    });

    it('should reject session outside event date range', () => {
      const outsideData = {
        start_time: '2024-03-14T12:00:00', // Antes del evento
        end_time: '2024-03-14T13:00:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(outsideData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('La sesión no puede comenzar antes del evento');
    });

    it('should reject session with times not on half-hour intervals', () => {
      const invalidTimeData = {
        start_time: '2024-03-15T12:15:00', // No está en intervalo de 30 minutos
        end_time: '2024-03-15T13:00:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(invalidTimeData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Las horas deben estar en intervalos de 30 minutos (00 o 30)');
    });

    it('should reject session with time conflict', () => {
      const conflictData = {
        start_time: '2024-03-15T10:30:00', // Se solapa con Sesión Existente 1
        end_time: '2024-03-15T11:30:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(conflictData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Conflicto de horario con las siguientes sesiones: Sesión Existente 1');
    });

    it('should warn about buffer conflicts', () => {
      const bufferConflictData = {
        start_time: '2024-03-15T11:05:00', // Muy cerca de Sesión Existente 1 (sin buffer de 15 min)
        end_time: '2024-03-15T12:05:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(bufferConflictData, mockExistingSessions);
      
      expect(result.isValid).toBe(true); // No es un error, solo advertencia
      expect(result.warnings).toContain('Se recomienda dejar al menos 15 minutos entre sesiones. Sesiones cercanas: Sesión Existente 1');
    });

    it('should handle invalid date formats', () => {
      const invalidData = {
        start_time: 'invalid-date',
        end_time: '2024-03-15T13:00:00',
        ...mockEventDates
      };

      const result = TimeValidator.validateSessionTimes(invalidData, mockExistingSessions);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Las fechas de inicio y fin deben ser válidas');
    });
  });

  describe('formatDuration', () => {
    it('should format duration less than 1 hour', () => {
      const duration = TimeValidator.formatDuration('2024-03-15T12:00:00', '2024-03-15T12:30:00');
      expect(duration).toBe('30 minutos');
    });

    it('should format duration of exactly 1 hour', () => {
      const duration = TimeValidator.formatDuration('2024-03-15T12:00:00', '2024-03-15T13:00:00');
      expect(duration).toBe('1 hora');
    });

    it('should format duration of multiple hours', () => {
      const duration = TimeValidator.formatDuration('2024-03-15T12:00:00', '2024-03-15T15:00:00');
      expect(duration).toBe('3 horas');
    });

    it('should format duration with hours and minutes', () => {
      const duration = TimeValidator.formatDuration('2024-03-15T12:00:00', '2024-03-15T13:30:00');
      expect(duration).toBe('1 hora y 30 minutos');
    });
  });

  describe('validateDateTimeLocalFormat', () => {
    it('should validate correct datetime-local format', () => {
      const validFormat = '2024-03-15T12:00';
      expect(TimeValidator.validateDateTimeLocalFormat(validFormat)).toBe(true);
    });

    it('should reject invalid datetime-local format', () => {
      const invalidFormats = [
        '2024-03-15 12:00',
        '2024/03/15T12:00',
        '2024-03-15T12:00:00',
        'invalid'
      ];

      invalidFormats.forEach(format => {
        expect(TimeValidator.validateDateTimeLocalFormat(format)).toBe(false);
      });
    });
  });

  describe('toDateTimeLocal', () => {
    it('should convert Date to datetime-local format', () => {
      const date = new Date('2024-03-15T12:30:00');
      const result = TimeValidator.toDateTimeLocal(date);
      expect(result).toBe('2024-03-15T12:30');
    });

    it('should handle single digit hours and minutes', () => {
      const date = new Date('2024-03-05T09:05:00');
      const result = TimeValidator.toDateTimeLocal(date);
      expect(result).toBe('2024-03-05T09:05');
    });
  });

  describe('getNextHalfHourSlot', () => {
    it('should return next half hour slot', () => {
      // Mock current time to 12:15
      const mockDate = new Date('2024-03-15T12:15:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const nextSlot = TimeValidator.getNextHalfHourSlot();
      expect(nextSlot.getMinutes()).toBe(30);
      expect(nextSlot.getHours()).toBe(12);

      jest.restoreAllMocks();
    });

    it('should return next hour when current time is past 30 minutes', () => {
      // Mock current time to 12:45
      const mockDate = new Date('2024-03-15T12:45:00');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      const nextSlot = TimeValidator.getNextHalfHourSlot();
      expect(nextSlot.getMinutes()).toBe(0);
      expect(nextSlot.getHours()).toBe(13);

      jest.restoreAllMocks();
    });
  });

  describe('getAvailableTimeSlots', () => {
    it('should return available time slots', () => {
      const eventStart = '2024-03-15T08:00:00';
      const eventEnd = '2024-03-15T18:00:00';
      const slotDuration = 60; // 1 hour

      const slots = TimeValidator.getAvailableTimeSlots(eventStart, eventEnd, mockExistingSessions, slotDuration);
      
      expect(slots.length).toBeGreaterThan(0);
      
      // Verificar que los slots no tienen conflictos
      slots.forEach(slot => {
        const slotEnd = new Date(slot.getTime() + slotDuration * 60 * 1000);
        const conflicts = mockExistingSessions.filter(session => {
          const sessionStart = new Date(session.start_time);
          const sessionEnd = new Date(session.end_time);
          return (slot < sessionEnd && slotEnd > sessionStart);
        });
        expect(conflicts).toHaveLength(0);
      });
    });

    it('should return empty array when no slots are available', () => {
      const eventStart = '2024-03-15T08:00:00';
      const eventEnd = '2024-03-15T18:00:00';
      
      // Crear sesiones que cubren todo el día
      const fullDaySessions = [
        {
          id: 1,
          title: 'Sesión Todo el Día',
          start_time: '2024-03-15T08:00:00',
          end_time: '2024-03-15T18:00:00'
        }
      ];

      const slots = TimeValidator.getAvailableTimeSlots(eventStart, eventEnd, fullDaySessions);
      expect(slots).toHaveLength(0);
    });
  });
});
