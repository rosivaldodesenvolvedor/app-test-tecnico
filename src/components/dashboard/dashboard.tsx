"use client";

import React from "react";
import axios, { AxiosError } from "axios";
import { FormEvent, useEffect, useRef, useState } from "react";
import DepositModal from "./depositCard";
import TransferModal from "./transferModal";
import TransactionList from "../transactionList/transactionList";


export function Dashboard() {

    const [balance, setBalance] = useState(0);
    const [name, setName] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTransferOpen, setIsTransferOpen] = useState(false);

    async function getBalance() {
        try {
            const response = await axios.get("/api/balance");
            setBalance(response.data.account.balance);
            setName(response.data.account.name)
        } catch (error) { }
    }

    const handleDeposit = async (value: number) => {
        try {
            await axios.put("/api/deposit", { balance: value });
            getBalance();
        } catch (error) { }
    };

    const handleTransfer = async (email: string, value: number) => {
        try {
            const response = await axios.put("/api/transfer", { destinationEmail: email, balance: value })
            getBalance();
        } catch (error) { }
    };

    useEffect(() => {
        getBalance();
    }, [])

    return (
        <div className="h-[100vh] bg-gradient-to-br from-blue-100 to-blue-300 flex p-4">
            <div className="bg-white shadow-xl rounded-2xl p-8  w-full">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">
                    Olá, {name}
                </h1>
                <p className="text-gray-500 mb-6">Bem-vindo de volta ao seu banco.</p>

                <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md">
                    <p className="text-lg">Seu saldo atual é:</p>
                    <p className="text-3xl font-bold mt-2">
                        R$ {balance.toFixed(2)}
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                    <button onClick={() => setIsModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
                        Depositar
                    </button>
                    <button onClick={() => setIsTransferOpen(true)} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg">
                        Tranferir
                    </button>
                </div>
                <TransactionList onRevert={getBalance} />
            </div>
            <DepositModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onDeposit={handleDeposit}
            />

            <TransferModal
                isOpen={isTransferOpen}
                onClose={() => setIsTransferOpen(false)}
                onTransfer={handleTransfer}
            />
        </div>
    );
}
