"use client";

import { useEffect, useState } from "react";

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (email: string, amount: number) => void;
}

export default function TransferModal({
  isOpen,
  onClose,
  onTransfer,
}: TransferModalProps) {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState<number>(0);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleSubmit = () => {
    if (!email || amount <= 0) return;
    onTransfer(email, amount);
    setEmail("");
    setAmount(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Fazer Transferência</h2>

        <label className="block mb-1 font-medium">E-mail do destinatário:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:border-blue-500"
        />

        <label className="block mb-1 font-medium">Valor a transferir:</label>
        <input
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />

        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Transferir
        </button>
      </div>
    </div>
  );
}
