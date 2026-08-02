import type { ReactNode } from "react";

import { FieldError } from "./FieldError";
import { FieldHint } from "./FieldHint";
import { FieldLabel } from "./FieldLabel";

type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  errorMessage?: string;
  children: ReactNode;
};

export const FormField = ({ id, label, hint, errorMessage, children }: FormFieldProps) => (
  <div className="flex flex-col gap-2">
    <FieldLabel htmlFor={id} label={label} />
    {children}
    {errorMessage === undefined ? (
      <FieldHint id={`${id}-message`} message={hint} />
    ) : (
      <FieldError id={`${id}-message`} message={errorMessage} />
    )}
  </div>
);
