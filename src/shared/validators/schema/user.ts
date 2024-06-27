import { z } from "zod";

export const UserValidateSchema = z.object({
  firstName: z.string().min(1, { message: 'Campo obrigatório' }),
  lastName: z.string().min(1, { message: 'Campo obrigatório' }),
  email: z.string().min(1, { message: 'Campo obrigatório' }).email({ message: 'Email inválido' }),
  password: z.string()
    .min(8, { message: 'Senha deve ter entre 8 e 255 caracteres' })
    .max(255, { message: 'Senha deve ter entre 8 e 255 caracteres' })
    .regex(/[A-Z]/, { message: 'Senha deve incluir letras maiúsculas' })
    .regex(/[a-z]/, { message: 'Senha deve incluir letras minúsculas' })
    .regex(/[0-9]/, { message: 'Senha deve incluir números' })
    .regex(/[^a-zA-Z0-9]/, { message: 'Senha deve incluir caracteres especiais' }),
  confirmPassword: z.string().min(1, { message: 'Campo obrigatório' }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: [ 'confirmPassword' ],
});