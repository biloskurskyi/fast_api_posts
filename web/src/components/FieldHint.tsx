type FieldHintProps = {
  id: string;
  message: string | undefined;
};

export const FieldHint = ({ id, message }: FieldHintProps) => {
  if (message === undefined) return null;

  return (
    <p id={id} className="text-secondary text-meta">
      {message}
    </p>
  );
};
