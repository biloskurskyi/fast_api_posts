"use client";

import { useTranslation } from "react-i18next";

import { FormField } from "@/components/FormField";
import { RangeField } from "@/components/RangeField";
import { LIMITS } from "@/constants/limits";

const TICK_KEYS = ["start", "middle", "end"] as const;

type AutoReplyDelayFieldProps = {
  id: string;
  delaySeconds: number;
  phraseLabel: string;
  onDelayChange: (delaySeconds: number) => void;
};

export const AutoReplyDelayField = ({
  id,
  delaySeconds,
  phraseLabel,
  onDelayChange,
}: AutoReplyDelayFieldProps) => {
  const { t } = useTranslation("settings");

  return (
    <FormField id={id} label={t("fields.delay.label")}>
      <p className="text-secondary text-meta">{phraseLabel}</p>
      <RangeField
        id={id}
        value={delaySeconds}
        min={LIMITS.autoReplyDelaySeconds.min}
        max={LIMITS.autoReplyDelaySeconds.max}
        step={LIMITS.autoReplyDelaySeconds.step}
        valueLabel={phraseLabel}
        onValueChange={onDelayChange}
      />
      <div className="text-secondary text-meta flex justify-between gap-2">
        {TICK_KEYS.map((tick) => (
          <span key={tick}>{t(`fields.delay.ticks.${tick}`)}</span>
        ))}
      </div>
    </FormField>
  );
};
