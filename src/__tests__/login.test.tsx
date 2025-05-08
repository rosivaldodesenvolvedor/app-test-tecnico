import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "../components/login/form";
import axios from "axios";
import { useRouter } from "next/navigation";

// Mocks
jest.mock("axios");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm", () => {
  const push = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push });
    jest.clearAllMocks();
  });

  it("renders login form fields", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Entrar/i })).toBeInTheDocument();
  });

  it("shows error message if login fails", async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error("Invalid login"));

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(screen.getByText(/Erro no login/i)).toBeInTheDocument();
      expect(
        screen.getByText(/Verifique suas credenciais/i)
      ).toBeInTheDocument();
    });
  });

  it("redirects on successful login", async () => {
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { token: "fake-token" },
    });

    render(<LoginForm />);

    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: "user@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/Senha/i), {
      target: { value: "correctpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /Entrar/i }));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/dashboard");
    });
  });
});
