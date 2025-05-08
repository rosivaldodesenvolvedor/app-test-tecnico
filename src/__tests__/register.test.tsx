import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RegisterForm } from "../components/register/form";
import { useRouter } from "next/navigation";
import axios from "axios";

// Mock do useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock do axios
jest.mock("axios");

describe("RegisterForm", () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
  });

  it("renders the form", () => {
    render(<RegisterForm />);
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Repita a senha/i)).toBeInTheDocument();
  });

  it("redirects to dashboard on successful registration", async () => {
    (axios.post as jest.Mock).mockResolvedValue({ data: { success: true } });

    render(<RegisterForm />);
    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByLabelText(/^Senha$/i), { target: { value: "password123" } });
    fireEvent.change(screen.getByLabelText(/Repita a senha/i), { target: { value: "password123" } });

    fireEvent.click(screen.getByRole("button", { name: /Cadastrar/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });
});