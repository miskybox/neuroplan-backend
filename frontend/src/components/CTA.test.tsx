import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { CTA as Cta } from "./CTA";

describe("CTA component", () => {
  it("renderiza título y botón de acción", () => {
    render(
      <MemoryRouter>
        <Cta />
      </MemoryRouter>
    );

    // Verificar que los elementos existen (sin toBeInTheDocument)
    const title = screen.queryByText(/Obtén tu titulación oficial homologada/i);
    expect(title).not.toBeNull();

    const button = screen.queryByRole("button", {
      name: /Crear mi Perfil NeuroAcadémico/i,
    });
    expect(button).not.toBeNull();
  });
});
