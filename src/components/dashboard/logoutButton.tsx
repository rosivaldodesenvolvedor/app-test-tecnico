'use client'

import { useRouter } from 'next/navigation'
import axios from "axios";

export default function LogoutButton() {
    const router = useRouter()


    async function logout() {
        try {
            await axios.post("/api/logout");
        } catch (error) { }
    }

    const handleLogout = () => {
        logout();
        router.push('/login')
    }

    return (
        <button
            onClick={handleLogout}
            className="absolute top-3 right-0 mt-2 mr-2 bg-red-500 text-white px-5 py-3 rounded-md text-base font-semibold hover:bg-red-600"
        >
            Logout
        </button>
    )
}