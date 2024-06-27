import { useCallback, useState } from "react";
import { UserValidateSchema } from "@/shared/validators/schema/user";
import { User } from "@/shared/types/response/user";

export default function useUserValidation() {
  const [ validationErrors, setValidationErrors ] = useState<Record<string, string | undefined>>({});

  const validateUser = useCallback((user: User) => {
    const result = UserValidateSchema.safeParse(user);
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

  return { validationErrors, validateUser, setValidationErrors };
}
