"use client";

import React, { useEffect, useState} from "react";
import axios from "axios";

interface Transaction {
  id: string;
  amount: number;
  toUserId: String;
  reversed: boolean;
}

interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  balance: number;
}

interface Props {
  onRevert: () => void;
}

export default function TransactionList({ onRevert }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchTransactions = async () => {
    const response = await axios.get("/api/transactions");
    setTransactions(response.data);
  };

  const handleRevert = async (id: string) => {
    await axios.post(`/api/reverse`, {
      transactionId: id
    });
    fetchTransactions();
    onRevert();
  };

  async function findAccounts() {
    const { data } = await axios.get(`/api/account`);
    setAccounts(data);
  };

  useEffect(() => {
    findAccounts();
    fetchTransactions();
  }, [onRevert]);


  const findName = (id: string) => {
    const result = accounts.find(res => res.id === id);
    return result?.name;
  }

  return (
    <div className="mt-10 bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Transações</h2>
      {transactions.length === 0 ? (
        <p className="text-gray-500">Nenhuma transação registrada.</p>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-gray-600">
              <th className="py-2">Valor</th>
              <th className="py-2">Destinatário</th>
              <th className="py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-gray-200">
                <td className="py-2 text-blue-700 font-medium">
                  R$ {transaction.amount.toFixed(2)}
                </td>
                <td className="py-2">{findName(transaction.toUserId)}</td>
                <td className="py-2">
                  <button
                    onClick={() => handleRevert(transaction.id)}
                    disabled={transaction.reversed}
                    className={`px-3 py-1 text-white rounded-lg ${transaction.reversed
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                  >
                    {transaction.reversed ? "Revertida" : "Reverter"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}