import { z } from "zod";

export const ProductValidateSchema = z.object({
  name: z.string()
    .min(1, { message: 'Nome é obrigatório' })
    .max(50, { message: 'Nome deve ter no máximo 50 caracteres' }),
  description: z.string()
    .min(1, { message: 'Descrição é obrigatória' })
    .max(50, { message: 'Descrição deve ter no máximo 50 caracteres' }),
  price: z.number()
    .positive({ message: 'Preço deve ser maior que zero' })
    .max(50, { message: 'Preço deve ter no máximo 50 caracteres' }),
  stock: z.number()
    .positive({ message: 'Estoque deve ser maior que zero' })
    .max(50, { message: 'Estoque deve ter no máximo 50 caracteres' }),
  category: z.string()
    .min(1, { message: 'Categoria é obrigatória' })
    .max(50, { message: 'Categoria deve ter no máximo 50 caracteres' }),
});
