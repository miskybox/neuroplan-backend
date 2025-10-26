import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import {
  Accessibility,
  X,
  RotateCcw,
  Focus,
  Brain,
  Eye,
  Users,
  BookOpen,
  Glasses,
  Settings,
  Palette,
  ChevronDown,
  ChevronUp,
  MousePointer,
  Search,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ZapOff,
  Image as ImageIcon,
  VolumeX,
  Sun,
  Moon,
  Contrast,
  Droplet,
  Keyboard,
  FileText,
} from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<AccessibilityPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const { settings, updateSettings, resetAll, resetContent, resetColor, applyProfile, applyColorblindProfile } = useAccessibility();
  
  // Estados para secciones colapsables
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Función para toggle de secciones
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-[90vh] overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 bg-primary text-primary-foreground">
          <div className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            <h2 className="text-lg font-bold">MENÚ DE ACCESIBILIDAD</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Botón Reset Global */}
        <div className="p-4">
          <Button
            variant="outline"
            onClick={resetAll}
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Restablecer Todo
          </Button>
        </div>

        <Separator />

        {/* Contenido con ScrollArea */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {/* Perfiles De Accesibilidad */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('accessibility-profiles')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Accessibility className="h-4 w-4" />
                  <span>Perfiles De Accesibilidad</span>
                </div>
                {expandedSections.includes('accessibility-profiles') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('accessibility-profiles') && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyProfile('epilepsia')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Focus className="h-4 w-4" />
                    <span className="text-xs">Epilepsia</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyProfile('aprendizaje')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Brain className="h-4 w-4" />
                    <span className="text-xs">Aprendizaje</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyProfile('discapacidad visual')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">Discapacidad visual</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyProfile('mayores')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Mayores</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyProfile('tdah')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Focus className="h-4 w-4" />
                    <span className="text-xs">TDAH</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyProfile('dislexia')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs">Dislexia</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Perfiles De Daltonismo */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('colorblind-profiles')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Glasses className="h-4 w-4" />
                  <span>Perfiles De Daltonismo</span>
                </div>
                {expandedSections.includes('colorblind-profiles') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('colorblind-profiles') && (
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyColorblindProfile('deuteranopia')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Deuteranopia</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyColorblindProfile('deuteranomalía')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Deuteranomalía</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyColorblindProfile('protanopia')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Protanopia</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyColorblindProfile('tritanopia')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Tritanopia</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyColorblindProfile('tritanomalía')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Tritanomalía</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => applyColorblindProfile('acromatopsia')}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Glasses className="h-4 w-4" />
                    <span className="text-xs">Acromatopsia</span>
                  </Button>
                </div>
              )}
            </div>

            {/* Herramientas de Accesibilidad Web */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('web-tools')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Herramientas de Accesibilidad</span>
                </div>
                {expandedSections.includes('web-tools') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('web-tools') && (
                <div className="mt-2 space-y-2">
                  {/* Cursores */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      <span className="text-sm">Cursor Negro</span>
                    </div>
                    <Switch 
                      checked={settings.cursorBlack} 
                      onCheckedChange={(checked) => updateSettings({ cursorBlack: checked })} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <MousePointer className="h-4 w-4" />
                      <span className="text-sm">Cursor Blanco</span>
                    </div>
                    <Switch 
                      checked={settings.cursorWhite} 
                      onCheckedChange={(checked) => updateSettings({ cursorWhite: checked })} 
                    />
                  </div>

                  {/* Guía de lectura */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">Guía de Lectura</span>
                    </div>
                    <Switch 
                      checked={settings.readingGuide} 
                      onCheckedChange={(checked) => updateSettings({ readingGuide: checked })} 
                    />
                  </div>

                  {/* Lupa */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      <span className="text-sm">Lupa</span>
                    </div>
                    <Switch 
                      checked={settings.magnifier} 
                      onCheckedChange={(checked) => updateSettings({ magnifier: checked })} 
                    />
                  </div>

                  {/* Navegación por teclado */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Keyboard className="h-4 w-4" />
                      <span className="text-sm">Navegación por Teclado</span>
                    </div>
                    <Switch checked={false} onCheckedChange={() => {}} />
                  </div>

                  {/* Alineación de texto */}
                  <div className="p-2 rounded bg-muted space-y-2">
                    <span className="text-sm font-medium">Alineación de texto</span>
                    <div className="grid grid-cols-4 gap-1">
                      <Button 
                        size="sm" 
                        variant={settings.textAlignment === 'left' ? 'default' : 'outline'}
                        onClick={() => updateSettings({ textAlignment: 'left' })}
                      >
                        <AlignLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={settings.textAlignment === 'center' ? 'default' : 'outline'}
                        onClick={() => updateSettings({ textAlignment: 'center' })}
                      >
                        <AlignCenter className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={settings.textAlignment === 'right' ? 'default' : 'outline'}
                        onClick={() => updateSettings({ textAlignment: 'right' })}
                      >
                        <AlignRight className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={settings.textAlignment === 'justify' ? 'default' : 'outline'}
                        onClick={() => updateSettings({ textAlignment: 'justify' })}
                      >
                        <AlignJustify className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Bloquear parpadeos */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <ZapOff className="h-4 w-4" />
                      <span className="text-sm">Bloquear Parpadeos</span>
                    </div>
                    <Switch 
                      checked={settings.blockFlashing} 
                      onCheckedChange={(checked) => updateSettings({ blockFlashing: checked })} 
                    />
                  </div>

                  {/* Enfoque */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Focus className="h-4 w-4" />
                      <span className="text-sm">Enfoque</span>
                    </div>
                    <Switch 
                      checked={settings.focusMode} 
                      onCheckedChange={(checked) => updateSettings({ focusMode: checked })} 
                    />
                  </div>

                  {/* Fuente dislexia */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Fuente Dislexia</span>
                    </div>
                    <Switch 
                      checked={settings.dyslexiaFont} 
                      onCheckedChange={(checked) => updateSettings({ dyslexiaFont: checked })} 
                    />
                  </div>

                  {/* Fuente legible */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Fuente Legible</span>
                    </div>
                    <Switch 
                      checked={settings.readableFont} 
                      onCheckedChange={(checked) => updateSettings({ readableFont: checked })} 
                    />
                  </div>

                  {/* Lectura fácil */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">Lectura Fácil</span>
                    </div>
                    <Switch 
                      checked={settings.easyReading} 
                      onCheckedChange={(checked) => updateSettings({ easyReading: checked })} 
                    />
                  </div>

                  {/* Modo lectura */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">Modo Lectura</span>
                    </div>
                    <Switch 
                      checked={settings.readingMode} 
                      onCheckedChange={(checked) => updateSettings({ readingMode: checked })} 
                    />
                  </div>

                  {/* Ocultar imágenes */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      <span className="text-sm">Ocultar Imágenes</span>
                    </div>
                    <Switch 
                      checked={settings.hideImages} 
                      onCheckedChange={(checked) => updateSettings({ hideImages: checked })} 
                    />
                  </div>

                  {/* Resaltar enlaces */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Resaltar Enlaces</span>
                    </div>
                    <Switch 
                      checked={settings.highlightLinks} 
                      onCheckedChange={(checked) => updateSettings({ highlightLinks: checked })} 
                    />
                  </div>

                  {/* Resaltar títulos */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">Resaltar Títulos</span>
                    </div>
                    <Switch 
                      checked={settings.highlightTitles} 
                      onCheckedChange={(checked) => updateSettings({ highlightTitles: checked })} 
                    />
                  </div>

                  {/* Silenciar sonidos */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <VolumeX className="h-4 w-4" />
                      <span className="text-sm">Silenciar Sonidos</span>
                    </div>
                    <Switch 
                      checked={settings.muteSounds} 
                      onCheckedChange={(checked) => updateSettings({ muteSounds: checked })} 
                    />
                  </div>

                  {/* Brillo alto */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span className="text-sm">Brillo Alto</span>
                    </div>
                    <Switch 
                      checked={settings.highBrightness} 
                      onCheckedChange={(checked) => updateSettings({ highBrightness: checked })} 
                    />
                  </div>

                  {/* Brillo bajo */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span className="text-sm">Brillo Bajo</span>
                    </div>
                    <Switch 
                      checked={settings.lowBrightness} 
                      onCheckedChange={(checked) => updateSettings({ lowBrightness: checked })} 
                    />
                  </div>

                  {/* Contraste alto */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Contrast className="h-4 w-4" />
                      <span className="text-sm">Contraste Alto</span>
                    </div>
                    <Switch 
                      checked={settings.highContrast} 
                      onCheckedChange={(checked) => updateSettings({ highContrast: checked })} 
                    />
                  </div>

                  {/* Contraste claro */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" />
                      <span className="text-sm">Contraste Claro</span>
                    </div>
                    <Switch 
                      checked={settings.lightContrast} 
                      onCheckedChange={(checked) => updateSettings({ lightContrast: checked })} 
                    />
                  </div>

                  {/* Contraste invertido */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Contrast className="h-4 w-4" />
                      <span className="text-sm">Contraste Invertido</span>
                    </div>
                    <Switch 
                      checked={settings.invertedContrast} 
                      onCheckedChange={(checked) => updateSettings({ invertedContrast: checked })} 
                    />
                  </div>

                  {/* Contraste oscuro */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      <span className="text-sm">Contraste Oscuro</span>
                    </div>
                    <Switch 
                      checked={settings.darkContrast} 
                      onCheckedChange={(checked) => updateSettings({ darkContrast: checked })} 
                    />
                  </div>

                  {/* Monocromo */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      <span className="text-sm">Monocromo</span>
                    </div>
                    <Switch 
                      checked={settings.monochrome} 
                      onCheckedChange={(checked) => updateSettings({ monochrome: checked })} 
                    />
                  </div>

                  {/* Saturación alta */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4" />
                      <span className="text-sm">Saturación Alta</span>
                    </div>
                    <Switch 
                      checked={settings.highSaturation} 
                      onCheckedChange={(checked) => updateSettings({ highSaturation: checked })} 
                    />
                  </div>

                  {/* Saturación baja */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted">
                    <div className="flex items-center gap-2">
                      <Droplet className="h-4 w-4" />
                      <span className="text-sm">Saturación Baja</span>
                    </div>
                    <Switch 
                      checked={settings.lowSaturation} 
                      onCheckedChange={(checked) => updateSettings({ lowSaturation: checked })} 
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Ajustes De Contenido */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('content-settings')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Ajustes De Contenido</span>
                </div>
                {expandedSections.includes('content-settings') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('content-settings') && (
                <div className="mt-2 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="fontSize-slider" className="text-sm font-medium">Tamaño de fuente</label>
                    <Slider
                      id="fontSize-slider"
                      value={[settings.fontSize]}
                      onValueChange={(value) => updateSettings({ fontSize: value[0] })}
                      max={200}
                      min={50}
                      step={10}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{settings.fontSize}%</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="letterSpacing-slider" className="text-sm font-medium">Espacio entre letras</label>
                    <Slider
                      id="letterSpacing-slider"
                      value={[settings.letterSpacing]}
                      onValueChange={(value) => updateSettings({ letterSpacing: value[0] })}
                      max={10}
                      min={-2}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{settings.letterSpacing}px</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="lineHeight-slider" className="text-sm font-medium">Espacio entre líneas</label>
                    <Slider
                      id="lineHeight-slider"
                      value={[settings.lineHeight]}
                      onValueChange={(value) => updateSettings({ lineHeight: value[0] })}
                      max={300}
                      min={100}
                      step={10}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{settings.lineHeight}%</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="wordSpacing-slider" className="text-sm font-medium">Espacio entre palabras</label>
                    <Slider
                      id="wordSpacing-slider"
                      value={[settings.wordSpacing]}
                      onValueChange={(value) => updateSettings({ wordSpacing: value[0] })}
                      max={20}
                      min={0}
                      step={1}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{settings.wordSpacing}px</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetContent}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restablecer Contenido
                  </Button>
                </div>
              )}
            </div>

            {/* Herramientas De Color */}
            <div>
              <Button
                variant="ghost"
                onClick={() => toggleSection('color-tools')}
                className="w-full justify-between bg-accessibility-bg hover:bg-accessibility-hover"
              >
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  <span>Herramientas De Color</span>
                </div>
                {expandedSections.includes('color-tools') ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
              
              {expandedSections.includes('color-tools') && (
                <div className="mt-2 space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="contrast-slider" className="text-sm font-medium">Contraste</label>
                    <Slider
                      id="contrast-slider"
                      value={[settings.contrast]}
                      onValueChange={(value) => updateSettings({ contrast: value[0] })}
                      max={150}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{settings.contrast}%</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="saturation-slider" className="text-sm font-medium">Saturación</label>
                    <Slider
                      id="saturation-slider"
                      value={[settings.saturation]}
                      onValueChange={(value) => updateSettings({ saturation: value[0] })}
                      max={200}
                      min={0}
                      step={10}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{settings.saturation}%</p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="brightness-slider" className="text-sm font-medium">Brillo</label>
                    <Slider
                      id="brightness-slider"
                      value={[settings.brightness]}
                      onValueChange={(value) => updateSettings({ brightness: value[0] })}
                      max={150}
                      min={50}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">{settings.brightness}%</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetColor}
                    className="w-full"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restablecer Color
                  </Button>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
