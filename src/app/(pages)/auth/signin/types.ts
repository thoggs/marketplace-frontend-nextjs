import { z } from "zod";

export type SignInFormType = {
  email: string,
  password: string,
}

export const SignInValidateSchema = z.object({
  email: z.string()
    .min(1, 'Campo obrigatório')
    .email({ message: 'Email inválido' }),
  password: z.string()
    .min(1, 'Campo obrigatório'),
})