type FieldLabelProps = {
  htmlFor: string;
  label: string;
};

export const FieldLabel = ({ htmlFor, label }: FieldLabelProps) => (
  <label htmlFor={htmlFor} className="text-text text-meta font-medium">
    {label}
  </label>
);
