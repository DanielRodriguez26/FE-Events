export interface TimeValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

export interface SessionTimeData {
    start_time: string;
    end_time: string;
    event_start_date?: string;
    event_end_date?: string;
}

export class TimeValidator {
    private static readonly MIN_SESSION_DURATION = 15; // minutos
    private static readonly MAX_SESSION_DURATION = 8; // horas
    private static readonly BUSINESS_HOURS_START = 8; // 8:00 AM
    private static readonly BUSINESS_HOURS_END = 22; // 10:00 PM
    private static readonly BUFFER_MINUTES = 15; // buffer entre sesiones

    /**
     * Validar horarios de sesión
     */
    static validateSessionTimes(data: SessionTimeData, existingSessions: any[] = []): TimeValidationResult {
        const errors: string[] = [];
        const warnings: string[] = [];

        try {
            const startTime = new Date(data.start_time);
            const endTime = new Date(data.end_time);
            const now = new Date();

            // Validación 1: Verificar que las fechas son válidas
            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
                errors.push("Las fechas de inicio y fin deben ser válidas");
                return { isValid: false, errors, warnings };
            }

            // Validación 2: Verificar que la hora de inicio sea en el futuro
            if (startTime <= now) {
                errors.push("La hora de inicio debe ser en el futuro");
            }

            // Validación 3: Verificar que la hora de fin sea después de la hora de inicio
            if (endTime <= startTime) {
                errors.push("La hora de fin debe ser después de la hora de inicio");
            }

            // Validación 4: Verificar duración mínima y máxima
            const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
            
            if (durationMinutes < this.MIN_SESSION_DURATION) {
                errors.push(`La duración mínima de una sesión es de ${this.MIN_SESSION_DURATION} minutos`);
            }
            
            if (durationMinutes > this.MAX_SESSION_DURATION * 60) {
                errors.push(`La duración máxima de una sesión es de ${this.MAX_SESSION_DURATION} horas`);
            }

            // Validación 5: Verificar horarios laborables
            const startHour = startTime.getHours();
            const endHour = endTime.getHours();
            
            if (startHour < this.BUSINESS_HOURS_START || endHour > this.BUSINESS_HOURS_END) {
                errors.push(`Las sesiones solo pueden programarse entre las ${this.BUSINESS_HOURS_START}:00 AM y las ${this.BUSINESS_HOURS_END}:00 PM`);
            }

            // Validación 6: Verificar que no cruce la medianoche
            if (startTime.toDateString() !== endTime.toDateString()) {
                errors.push("Las sesiones no pueden cruzar la medianoche");
            }

            // Validación 7: Verificar que esté dentro del rango del evento
            if (data.event_start_date && data.event_end_date) {
                const eventStart = new Date(data.event_start_date);
                const eventEnd = new Date(data.event_end_date);
                
                if (startTime < eventStart) {
                    errors.push("La sesión no puede comenzar antes del evento");
                }
                
                if (endTime > eventEnd) {
                    errors.push("La sesión no puede terminar después del evento");
                }
            }

            // Validación 8: Verificar intervalos de 30 minutos
            const startMinute = startTime.getMinutes();
            const endMinute = endTime.getMinutes();
            
            if (startMinute !== 0 && startMinute !== 30) {
                errors.push("Las horas deben estar en intervalos de 30 minutos (00 o 30)");
            }
            
            if (endMinute !== 0 && endMinute !== 30) {
                errors.push("Las horas deben estar en intervalos de 30 minutos (00 o 30)");
            }

            // Validación 9: Verificar conflictos con sesiones existentes
            const conflicts = this.checkTimeConflicts(startTime, endTime, existingSessions);
            if (conflicts.length > 0) {
                const conflictNames = conflicts.map(s => s.title).join(', ');
                errors.push(`Conflicto de horario con las siguientes sesiones: ${conflictNames}`);
            }

            // Validación 10: Verificar buffer entre sesiones
            const bufferConflicts = this.checkBufferConflicts(startTime, endTime, existingSessions);
            if (bufferConflicts.length > 0) {
                const conflictNames = bufferConflicts.map(s => s.title).join(', ');
                warnings.push(`Se recomienda dejar al menos ${this.BUFFER_MINUTES} minutos entre sesiones. Sesiones cercanas: ${conflictNames}`);
            }

        } catch (error) {
            errors.push("Error al validar los horarios");
            console.error("Time validation error:", error);
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    /**
     * Verificar conflictos de horario con sesiones existentes
     */
    private static checkTimeConflicts(startTime: Date, endTime: Date, existingSessions: any[]): any[] {
        return existingSessions.filter(session => {
            const sessionStart = new Date(session.start_time);
            const sessionEnd = new Date(session.end_time);
            
            // Verificar si hay solapamiento
            return (startTime < sessionEnd && endTime > sessionStart);
        });
    }

    /**
     * Verificar conflictos de buffer entre sesiones
     */
    private static checkBufferConflicts(startTime: Date, endTime: Date, existingSessions: any[]): any[] {
        const bufferMs = this.BUFFER_MINUTES * 60 * 1000;
        
        return existingSessions.filter(session => {
            const sessionStart = new Date(session.start_time);
            const sessionEnd = new Date(session.end_time);
            
            // Verificar si hay conflicto incluyendo el buffer
            const startWithBuffer = new Date(startTime.getTime() - bufferMs);
            const endWithBuffer = new Date(endTime.getTime() + bufferMs);
            
            return (startWithBuffer < sessionEnd && endWithBuffer > sessionStart);
        });
    }

    /**
     * Formatear duración en formato legible
     */
    static formatDuration(startTime: string, endTime: string): string {
        const start = new Date(startTime);
        const end = new Date(endTime);
        const durationMs = end.getTime() - start.getTime();
        const durationMinutes = Math.floor(durationMs / (1000 * 60));
        
        if (durationMinutes < 60) {
            return `${durationMinutes} minutos`;
        } else {
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;
            if (minutes === 0) {
                return `${hours} hora${hours > 1 ? 's' : ''}`;
            } else {
                return `${hours} hora${hours > 1 ? 's' : ''} y ${minutes} minutos`;
            }
        }
    }

    /**
     * Obtener sugerencias de horarios disponibles
     */
    static getAvailableTimeSlots(eventStart: string, eventEnd: string, existingSessions: any[], slotDuration: number = 60): Date[] {
        const slots: Date[] = [];
        const eventStartDate = new Date(eventStart);
        const eventEndDate = new Date(eventEnd);
        
        // Generar slots de 30 minutos desde el inicio del evento
        let currentSlot = new Date(eventStartDate);
        currentSlot.setMinutes(Math.ceil(currentSlot.getMinutes() / 30) * 30, 0, 0);
        
        while (currentSlot < eventEndDate) {
            const slotEnd = new Date(currentSlot.getTime() + slotDuration * 60 * 1000);
            
            // Verificar si el slot está disponible
            const conflicts = this.checkTimeConflicts(currentSlot, slotEnd, existingSessions);
            
            if (conflicts.length === 0 && slotEnd <= eventEndDate) {
                slots.push(new Date(currentSlot));
            }
            
            // Avanzar 30 minutos
            currentSlot.setMinutes(currentSlot.getMinutes() + 30);
        }
        
        return slots;
    }

    /**
     * Validar formato de hora para input datetime-local
     */
    static validateDateTimeLocalFormat(value: string): boolean {
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        return regex.test(value);
    }

    /**
     * Convertir fecha a formato datetime-local
     */
    static toDateTimeLocal(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    /**
     * Obtener el próximo slot de 30 minutos
     */
    static getNextHalfHourSlot(): Date {
        const now = new Date();
        const nextSlot = new Date(now);
        
        // Redondear hacia arriba al próximo intervalo de 30 minutos
        const minutes = nextSlot.getMinutes();
        if (minutes < 30) {
            nextSlot.setMinutes(30, 0, 0);
        } else {
            nextSlot.setHours(nextSlot.getHours() + 1, 0, 0, 0);
        }
        
        return nextSlot;
    }
}
