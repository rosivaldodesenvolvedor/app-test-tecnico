"use client";

import { useEffect } from "react";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (value: number) => void;
}

export default function DepositModal({ isOpen, onClose, onDeposit }: DepositModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  let depositValue = 0;

  const handleSubmit = () => {
    onDeposit(depositValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          &times;
        </button>
        <h2 className="text-lg font-bold mb-4">Fazer Depósito</h2>
        <label className="block mb-2 font-medium">Valor a depositar:</label>
        <input
          type="number"
          min="0"
          step="0.01"
          onChange={(e) => (depositValue = parseFloat(e.target.value))}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Depositar
        </button>
      </div>
    </div>
  );
}
