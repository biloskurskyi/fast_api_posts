type FieldErrorProps = {
  id: string;
  message: string;
};

export const FieldError = ({ id, message }: FieldErrorProps) => (
  <p id={id} className="text-blocked-fg text-meta">
    {message}
  </p>
);
