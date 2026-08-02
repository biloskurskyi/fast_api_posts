import { Button } from "@/components/Button";

type ConfirmDeleteDialogProps = {
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isBusy: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export const ConfirmDeleteDialog = ({
  message,
  confirmLabel,
  cancelLabel,
  isBusy,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) => (
  <div className="bg-blocked-bg border-blocked-border text-blocked-fg text-ui flex flex-wrap items-center gap-3 rounded-md border p-3">
    <p className="flex-1">{message}</p>
    <Button
      label={cancelLabel}
      type="button"
      variant="secondary"
      size="touch"
      isFullWidth={false}
      isDisabled={isBusy}
      isBusy={false}
      onClick={onCancel}
    />
    <Button
      label={confirmLabel}
      type="button"
      variant="danger"
      size="touch"
      isFullWidth={false}
      isDisabled={false}
      isBusy={isBusy}
      onClick={onConfirm}
    />
  </div>
);
