import { useCallback, useState } from "react";
import { Product } from "@/shared/types/response/product";
import { ProductValidateSchema } from "@/shared/validators/schema/product";

export default function useProductValidation() {
  const [ validationErrors, setValidationErrors ] = useState<Record<string, string | undefined>>({});

  const validateProduct = useCallback((product: Product) => {
    const result = ProductValidateSchema.safeParse(product);
    if (!result.success) {
      const errors = Object.fromEntries(
        Object.entries(result.error.flatten().fieldErrors)
          .map(([ key, value ]) => [ key, value.join(', ') ])
      );
      setValidationErrors(errors);
      return errors;
    } else {
      setValidationErrors({});
      return {};
    }
  }, []);

  return { validationErrors, validateProduct, setValidationErrors };
}
