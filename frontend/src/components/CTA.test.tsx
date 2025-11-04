import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CTA from './CTA';

describe('CTA component', () => {
  it('renderiza título y botón de acción', () => {
    render(
      <MemoryRouter>
        <CTA />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/Obtén tu titulación oficial homologada/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Crear mi Perfil NeuroAcadémico/i })
    ).toBeInTheDocument();
  });
});
