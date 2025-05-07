"use client";

import { Dashboard } from "@/components/dashboard/dashboard";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [validSession, setValidSession] = useState(false);

  const router = useRouter();

  const validationSession = async () => {
    try {
      const response = await axios.get("/api/balance");
      if (response.data.user === "Unauthorized") {
        setValidSession(false);
        router.push("/login");
      } else {
        setValidSession(true);
      }
    } catch (error) {
      console.log("erro", error);
    }
  };

  useEffect(() => {
    validationSession();
  }, []);

  return validSession && <Dashboard />;
}
