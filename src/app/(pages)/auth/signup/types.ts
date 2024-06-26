import { z } from "zod";

export type SignUpFormType = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  confirmPassword: string,
}

export const SignUpValidateSchema = z.object({
  firstName: z.string()
    .min(1, { message: 'Campo obrigatório' }),
  lastName: z.string()
    .min(1, { message: 'Campo obrigatório' }),
  email: z.string()
    .min(1, { message: 'Campo obrigatório' })
    .email({ message: 'Email inválido' }),
  password: z.string()
    .min(1, { message: 'Campo obrigatório' }),
  confirmPassword: z.string()
    .min(1, { message: 'Campo obrigatório' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: [ 'confirmPassword' ],
});