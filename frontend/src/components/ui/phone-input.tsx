import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Phone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

interface PhoneInputProps {
  value?: string;
  onChange: (phone: string) => void;
  placeholder?: string;
  label?: string;
  disabled?: boolean;
  className?: string;
  error?: string;
}

// Lista de países con sus códigos de teléfono
const countries: Country[] = [
  { code: "ES", name: "España", flag: "🇪🇸", dialCode: "+34" },
  { code: "FR", name: "Francia", flag: "🇫🇷", dialCode: "+33" },
  { code: "IT", name: "Italia", flag: "🇮🇹", dialCode: "+39" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", dialCode: "+351" },
  { code: "DE", name: "Alemania", flag: "🇩🇪", dialCode: "+49" },
  { code: "GB", name: "Reino Unido", flag: "🇬🇧", dialCode: "+44" },
  { code: "US", name: "Estados Unidos", flag: "🇺🇸", dialCode: "+1" },
  { code: "CA", name: "Canadá", flag: "🇨🇦", dialCode: "+1" },
  { code: "MX", name: "México", flag: "🇲🇽", dialCode: "+52" },
  { code: "AR", name: "Argentina", flag: "🇦🇷", dialCode: "+54" },
  { code: "BR", name: "Brasil", flag: "🇧🇷", dialCode: "+55" },
  { code: "CL", name: "Chile", flag: "🇨🇱", dialCode: "+56" },
  { code: "CO", name: "Colombia", flag: "🇨🇴", dialCode: "+57" },
  { code: "PE", name: "Perú", flag: "🇵🇪", dialCode: "+51" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪", dialCode: "+58" },
  { code: "UY", name: "Uruguay", flag: "🇺🇾", dialCode: "+598" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾", dialCode: "+595" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴", dialCode: "+591" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨", dialCode: "+593" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷", dialCode: "+506" },
  { code: "PA", name: "Panamá", flag: "🇵🇦", dialCode: "+507" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹", dialCode: "+502" },
  { code: "HN", name: "Honduras", flag: "🇭🇳", dialCode: "+504" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻", dialCode: "+503" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮", dialCode: "+505" },
  { code: "CU", name: "Cuba", flag: "🇨🇺", dialCode: "+53" },
  { code: "DO", name: "República Dominicana", flag: "🇩🇴", dialCode: "+1" },
  { code: "PR", name: "Puerto Rico", flag: "🇵🇷", dialCode: "+1" },
  { code: "JP", name: "Japón", flag: "🇯🇵", dialCode: "+81" },
  { code: "CN", name: "China", flag: "🇨🇳", dialCode: "+86" },
  { code: "KR", name: "Corea del Sur", flag: "🇰🇷", dialCode: "+82" },
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "NZ", name: "Nueva Zelanda", flag: "🇳🇿", dialCode: "+64" },
  { code: "ZA", name: "Sudáfrica", flag: "🇿🇦", dialCode: "+27" },
  { code: "EG", name: "Egipto", flag: "🇪🇬", dialCode: "+20" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", dialCode: "+234" },
  { code: "KE", name: "Kenia", flag: "🇰🇪", dialCode: "+254" },
  { code: "MA", name: "Marruecos", flag: "🇲🇦", dialCode: "+212" },
  { code: "RU", name: "Rusia", flag: "🇷🇺", dialCode: "+7" },
  { code: "TR", name: "Turquía", flag: "🇹🇷", dialCode: "+90" },
  { code: "SA", name: "Arabia Saudí", flag: "🇸🇦", dialCode: "+966" },
  { code: "AE", name: "Emiratos Árabes Unidos", flag: "🇦🇪", dialCode: "+971" },
  { code: "IL", name: "Israel", flag: "🇮🇱", dialCode: "+972" },
  { code: "TH", name: "Tailandia", flag: "🇹🇭", dialCode: "+66" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳", dialCode: "+84" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩", dialCode: "+62" },
  { code: "MY", name: "Malasia", flag: "🇲🇾", dialCode: "+60" },
  { code: "SG", name: "Singapur", flag: "🇸🇬", dialCode: "+65" },
  { code: "PH", name: "Filipinas", flag: "🇵🇭", dialCode: "+63" },
  { code: "NO", name: "Noruega", flag: "🇳🇴", dialCode: "+47" },
  { code: "SE", name: "Suecia", flag: "🇸🇪", dialCode: "+46" },
  { code: "DK", name: "Dinamarca", flag: "🇩🇰", dialCode: "+45" },
  { code: "FI", name: "Finlandia", flag: "🇫🇮", dialCode: "+358" },
  { code: "NL", name: "Países Bajos", flag: "🇳🇱", dialCode: "+31" },
  { code: "BE", name: "Bélgica", flag: "🇧🇪", dialCode: "+32" },
  { code: "CH", name: "Suiza", flag: "🇨🇭", dialCode: "+41" },
  { code: "AT", name: "Austria", flag: "🇦🇹", dialCode: "+43" },
  { code: "IE", name: "Irlanda", flag: "🇮🇪", dialCode: "+353" },
  { code: "PL", name: "Polonia", flag: "🇵🇱", dialCode: "+48" },
  { code: "CZ", name: "República Checa", flag: "🇨🇿", dialCode: "+420" },
  { code: "HU", name: "Hungría", flag: "🇭🇺", dialCode: "+36" },
  { code: "RO", name: "Rumania", flag: "🇷🇴", dialCode: "+40" },
  { code: "BG", name: "Bulgaria", flag: "🇧🇬", dialCode: "+359" },
  { code: "HR", name: "Croacia", flag: "🇭🇷", dialCode: "+385" },
  { code: "SI", name: "Eslovenia", flag: "🇸🇮", dialCode: "+386" },
  { code: "SK", name: "Eslovaquia", flag: "🇸🇰", dialCode: "+421" },
  { code: "LT", name: "Lituania", flag: "🇱🇹", dialCode: "+370" },
  { code: "LV", name: "Letonia", flag: "🇱🇻", dialCode: "+371" },
  { code: "EE", name: "Estonia", flag: "🇪🇪", dialCode: "+372" },
  { code: "GR", name: "Grecia", flag: "🇬🇷", dialCode: "+30" },
  { code: "CY", name: "Chipre", flag: "🇨🇾", dialCode: "+357" },
  { code: "MT", name: "Malta", flag: "🇲🇹", dialCode: "+356" },
  { code: "LU", name: "Luxemburgo", flag: "🇱🇺", dialCode: "+352" },
  { code: "IS", name: "Islandia", flag: "🇮🇸", dialCode: "+354" },
  { code: "LI", name: "Liechtenstein", flag: "🇱🇮", dialCode: "+423" },
  { code: "MC", name: "Mónaco", flag: "🇲🇨", dialCode: "+377" },
  { code: "SM", name: "San Marino", flag: "🇸🇲", dialCode: "+378" },
  { code: "VA", name: "Ciudad del Vaticano", flag: "🇻🇦", dialCode: "+379" },
  { code: "AD", name: "Andorra", flag: "🇦🇩", dialCode: "+376" },
];

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value = "",
  onChange,
  placeholder = "Número de teléfono",
  label,
  disabled = false,
  className,
  error,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // España por defecto
  const [phoneNumber, setPhoneNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputError, setInputError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar países basado en la búsqueda
  const filteredCountries = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      country.dialCode.includes(searchQuery) ||
      country.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Parsear el valor inicial si viene con código de país
  useEffect(() => {
    if (value) {
      const country = countries.find((c) => value.startsWith(c.dialCode));
      if (country) {
        setSelectedCountry(country);
        setPhoneNumber(value.substring(country.dialCode.length));
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // Manejar cambio en el número de teléfono
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;

    // Solo permitir números, espacios, guiones y paréntesis
    const cleanInput = input.replace(/[^\d\s\-()]/g, "");
    setPhoneNumber(cleanInput);
    setInputError("");

    // Validar formato básico
    if (cleanInput && cleanInput.length < 6) {
      setInputError("El número de teléfono debe tener al menos 6 dígitos");
    } else if (cleanInput && cleanInput.length > 15) {
      setInputError("El número de teléfono no puede tener más de 15 dígitos");
    } else {
      setInputError("");
    }

    // Actualizar el valor completo
    const fullPhone = selectedCountry.dialCode + cleanInput;
    onChange(fullPhone);
  };

  // Manejar selección de país
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setSearchQuery("");
    setIsOpen(false);

    // Actualizar el valor completo con el nuevo código de país
    const fullPhone = country.dialCode + phoneNumber;
    onChange(fullPhone);
  };

  // Limpiar el número
  const clearPhone = () => {
    setPhoneNumber("");
    onChange("");
    setInputError("");
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor="phone-input" className="text-sm font-medium">
          {label}
        </Label>
      )}

      <div className="relative">
        <div className="flex">
          {/* Selector de país */}
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "rounded-r-none border-r-0 px-3 h-10 min-w-[120px] justify-between",
                  error || inputError ? "border-destructive" : ""
                )}
                disabled={disabled}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="text-sm font-medium">
                    {selectedCountry.dialCode}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80 p-0" align="start">
              <div className="p-4">
                {/* Búsqueda */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar país..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Lista de países */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredCountries.map((country) => (
                    <Button
                      key={country.code}
                      type="button"
                      variant="ghost"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleCountrySelect(country)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <span className="text-lg">{country.flag}</span>
                        <div className="flex-1 text-left">
                          <div className="font-medium text-sm">
                            {country.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {country.dialCode}
                          </div>
                        </div>
                        {selectedCountry.code === country.code && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </Button>
                  ))}

                  {filteredCountries.length === 0 && (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No se encontraron países
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Input del número */}
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              id="phone-input"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                "rounded-l-none border-l-0 pl-3 pr-10",
                error || inputError ? "border-destructive" : ""
              )}
            />

            {phoneNumber && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={clearPhone}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mensaje de error */}
      {(error || inputError) && (
        <p className="text-sm text-destructive">{error || inputError}</p>
      )}

      {/* Información adicional */}
      <p className="text-xs text-muted-foreground">
        Formato: {selectedCountry.dialCode} XXX XXX XXX
      </p>
    </div>
  );
};
