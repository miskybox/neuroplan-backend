import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Accessibility } from 'lucide-react';

interface AccessibilityTriggerProps {
  onClick: () => void;
}

export const AccessibilityTrigger: React.FC<AccessibilityTriggerProps> = ({ onClick }) => {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 2147483647,
        pointerEvents: 'none',
      }}
      className="accessibility-trigger-wrapper"
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onClick}
              size="lg"
              style={{
                pointerEvents: 'auto',
                borderRadius: '50%',
                width: '56px',
                height: '56px',
                padding: 0,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
                backgroundColor: 'hsl(var(--primary))',
                color: 'white',
              }}
              aria-label="Abrir panel de accesibilidad"
              className="hover:scale-110 transition-transform duration-200 accessibility-trigger-btn"
            >
              <Accessibility className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Accesibilidad</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
