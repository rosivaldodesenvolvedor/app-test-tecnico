import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import TransactionList from "..//components/transactionList/transactionList";
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("TransactionList", () => {
  const mockOnRevert = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir uma mensagem quando não há transações", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<TransactionList onRevert={mockOnRevert}/>);

    await waitFor(() => {
      expect(
        screen.getByText("Nenhuma transação registrada.")
      ).toBeInTheDocument();
    });
  });

  it("deve renderizar a lista de transações", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: "cmaebnu3f000myk5lrkn5p72x",
          fromUserId: "cmaebl3m5000gyk5lh9vx009j",
          toUserId: "cmae3zrhq0000yk5lmwllsnrs",
          toUserName: "Annna",
          amount: 200,
          reversed: false,
        },
      ],
    });

    render(<TransactionList onRevert={mockOnRevert}/>);

    await waitFor(() => {
      expect(screen.getByText("Annna")).toBeInTheDocument();
      expect(screen.getByText("R$ 200.00")).toBeInTheDocument();
    });
  });

  it("deve chamar a função de reversão ao clicar em Reverter", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: "cmaebnu3f000myk5lrkn5p72x",
          fromUserId: "cmaebl3m5000gyk5lh9vx009j",
          toUserId: "cmae3zrhq0000yk5lmwllsnrs",
          toUserName: "Annna",
          amount: 200,
          reversed: false,
        },
      ],
    });

    mockedAxios.post.mockResolvedValueOnce({});
    mockedAxios.get.mockResolvedValueOnce({ data: [] });

    render(<TransactionList onRevert={mockOnRevert} />);

    await waitFor(() => {
      const button = screen.getByText("Reverter");
      fireEvent.click(button);
    });
  });
});
