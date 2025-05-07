"use client";

import { RegisterResponse } from "@/app/api/register/route";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios, { AxiosError } from "axios";
import { LoaderPinwheel } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useRef, useState } from "react";

export function RegisterForm() {
  const router = useRouter();

  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const password2InputRef = useRef<HTMLInputElement>(null);

  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const handleRegisterSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setFormError("");
      setFormLoading(true);

      const emailReg = new RegExp(
        "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
      );

      if (
        emailInputRef.current &&
        password2InputRef.current &&
        passwordInputRef.current &&
        nameInputRef.current
      ) {
        const name = nameInputRef.current.value;
        const email = emailInputRef.current.value;
        const pass1 = passwordInputRef.current.value;
        const pass2 = password2InputRef.current.value;

        let shouldReturnError = false;

        if (!emailReg.test(email)) {
          setFormError("Please enter a valid email address.");
          shouldReturnError = true;
        }

        if (pass1.length < 8) {
          setFormError("Password must be at least 8 characters long.");
          shouldReturnError = true;
        }

        if (pass1 !== pass2) {
          setFormError("The passwords are not the same.");
          shouldReturnError = true;
        }

        if (shouldReturnError) {
          setFormLoading(false);
          setFormSuccess(false);
          return;
        }

        try {
          const response = await axios.post<RegisterResponse>("/api/register", {
            name,
            email,
            password: pass1,
            password2: pass2,
          });

          router.push("/dashboard");

          setFormLoading(false);
          setFormSuccess(true);
        } catch (error) {
          if (error instanceof AxiosError) {
            const { error: errorMessage } = error.response
              ?.data as RegisterResponse;

            if (errorMessage === "user already exists") {
              setFormError("This email is already registered. Try logging in.");
            } else {
              setFormError(errorMessage || error.message);
            }
          }
          setFormLoading(false);
          setFormSuccess(false);
        }
      }
    },
    [router]
  );

  return (
    <form onSubmit={(event) => handleRegisterSubmit(event)}>
      <Card className="w-full max-w-sm m-auto mt-5">
        <CardHeader>
          <CardTitle className="text-2xl">Cadastro</CardTitle>
          <CardDescription>
            Insira seus dados para se cadastrar.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              ref={nameInputRef}
              id="nome"
              type="nome"
              placeholder="seu nome"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              ref={emailInputRef}
              id="email"
              type="email"
              placeholder="seu@email.com.br"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              ref={passwordInputRef}
              id="password"
              type="password"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password2">Repita a senha</Label>
            <Input
              ref={password2InputRef}
              id="password2"
              type="password"
              required
            />
          </div>
        </CardContent>
        <CardFooter className="grid">
          {formError && (
            <div className="text-amber-600 mb-4">
              <p className="text-sm font-semibold">Erro no formulário</p>
              <p>{formError}</p>
            </div>
          )}
          {formSuccess && (
            <div className="text-rose-600 mb-4">
              <p className="text-sm font-semibold">
                Cadastro realizado, redirecionando para o dashboard
              </p>
            </div>
          )}
          <Button
            className="w-full flex items-center gap-2"
            disabled={formLoading}
          >
            {formLoading && (
              <LoaderPinwheel className="w-[18px] animate-spin" />
            )}
            Cadastrar
          </Button>
          <div className="mt-5 underline text-center">
            <Link href="/login">Ir para o login</Link>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
