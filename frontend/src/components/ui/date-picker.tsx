import React, { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  label,
  disabled = false,
  className,
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [inputValue, setInputValue] = useState(value || "");
  const [inputError, setInputError] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const currentDate = new Date();
  const maxYear = currentDate.getFullYear();
  const minYear = maxYear - 100; // Permitir hasta 100 años atrás

  // Generar años para el selector
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

  // Obtener días del mes actual
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Obtener el primer día de la semana del mes
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generar días del calendario
  const generateCalendarDays = () => {
    const days = [];
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

    // Días del mes anterior (para completar la primera semana)
    for (let i = firstDay - 1; i >= 0; i--) {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const day = getDaysInMonth(prevMonth, prevYear) - i;
      days.push({
        day,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = 
        day === currentDate.getDate() &&
        currentMonth === currentDate.getMonth() &&
        currentYear === currentDate.getFullYear();
      
      const isSelected = value && (() => {
        const selectedDate = new Date(value);
        return day === selectedDate.getDate() &&
               currentMonth === selectedDate.getMonth() &&
               currentYear === selectedDate.getFullYear();
      })();

      days.push({
        day,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isToday,
        isSelected
      });
    }

    // Días del mes siguiente (para completar la última semana)
    const remainingDays = 42 - days.length; // 6 semanas x 7 días
    for (let day = 1; day <= remainingDays; day++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      days.push({
        day,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        isToday: false,
        isSelected: false
      });
    }

    return days;
  };

  // Manejar selección de fecha
  const handleDateSelect = (day: number, month: number, year: number) => {
    const selectedDate = new Date(year, month, day);
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    // Validar que no sea una fecha futura
    if (selectedDate > currentDate) {
      setInputError("La fecha de nacimiento no puede ser futura");
      return;
    }

    // Validar edad mínima (por ejemplo, 5 años)
    const age = currentDate.getFullYear() - year;
    if (age < 5) {
      setInputError("Debes tener al menos 5 años");
      return;
    }

    setInputValue(formattedDate);
    onChange(formattedDate);
    setInputError("");
    setIsOpen(false);
  };

  // Manejar cambio en el input manual
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    setInputError("");

    // Validar formato de fecha
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (inputVal && dateRegex.test(inputVal)) {
      const inputDate = new Date(inputVal);
      if (inputDate > currentDate) {
        setInputError("La fecha de nacimiento no puede ser futura");
        return;
      }
      onChange(inputVal);
    }
  };

  // Navegación del calendario
  const goToPreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Cambiar año
  const handleYearChange = (year: number) => {
    setCurrentYear(year);
  };

  // Cambiar mes
  const handleMonthChange = (month: number) => {
    setCurrentMonth(month);
  };

  // Limpiar fecha
  const clearDate = () => {
    setInputValue("");
    onChange("");
    setInputError("");
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="date-picker" className="text-sm font-medium">
          {label}
        </Label>
      )}
      
      <div className="relative">
        <Input
          ref={inputRef}
          id="date-picker"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "pr-20",
            error || inputError ? "border-destructive" : ""
          )}
          onFocus={() => setIsOpen(true)}
        />
        
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearDate}
              className="h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-muted"
                disabled={disabled}
              >
                <Calendar className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            
            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4">
                {/* Header del calendario */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={currentMonth}
                      onChange={(e) => handleMonthChange(Number(e.target.value))}
                      className="bg-transparent border-none outline-none text-sm font-medium"
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index}>
                          {month}
                        </option>
                      ))}
                    </select>
                    
                    <select
                      value={currentYear}
                      onChange={(e) => handleYearChange(Number(e.target.value))}
                      className="bg-transparent border-none outline-none text-sm font-medium"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={goToPreviousMonth}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={goToNextMonth}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Días de la semana */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-muted-foreground py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Días del calendario */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((dayData, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-8 w-8 p-0 text-xs",
                        !dayData.isCurrentMonth && "text-muted-foreground/50",
                        dayData.isToday && "bg-primary text-primary-foreground font-bold",
                        dayData.isSelected && "bg-primary text-primary-foreground",
                        dayData.isCurrentMonth && !dayData.isToday && !dayData.isSelected && "hover:bg-muted"
                      )}
                      onClick={() => {
                        if (dayData.isCurrentMonth) {
                          handleDateSelect(dayData.day, dayData.month, dayData.year);
                        }
                      }}
                    >
                      {dayData.day}
                    </Button>
                  ))}
                </div>

                {/* Información adicional */}
                <div className="mt-4 pt-4 border-t text-xs text-muted-foreground text-center">
                  <p>Selecciona tu fecha de nacimiento</p>
                  <p className="mt-1">Formato: AAAA-MM-DD</p>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Mensaje de error */}
      {(error || inputError) && (
        <p className="text-sm text-destructive">
          {error || inputError}
        </p>
      )}
    </div>
  );
};
