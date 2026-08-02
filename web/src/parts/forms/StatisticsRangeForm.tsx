"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/Button";
import { DateField } from "@/components/DateField";
import { FormField } from "@/components/FormField";
import { Surface } from "@/components/Surface";
import type { StatisticsRange } from "@/types/statistics";

import {
  createStatisticsRangeFormDefaults,
  statisticsRangeFormSchema,
  type StatisticsRangeFormValues,
} from "./statisticsRangeForm.schema";

const DATE_FROM_ID = "statistics-date-from";
const DATE_TO_ID = "statistics-date-to";

type StatisticsRangeFormProps = {
  latestDate: string;
  isPending: boolean;
  onSubmit: (range: StatisticsRange) => void;
  onEdit: () => void;
};

export const StatisticsRangeForm = ({
  latestDate,
  isPending,
  onSubmit,
  onEdit,
}: StatisticsRangeFormProps) => {
  const { t } = useTranslation("statistics");
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<StatisticsRangeFormValues>({
    resolver: zodResolver(statisticsRangeFormSchema),
    defaultValues: createStatisticsRangeFormDefaults(),
  });

  const dateFromError = errors.dateFrom?.message;
  const dateToError = errors.dateTo?.message;
  const dateFromRegistration = register("dateFrom", { onChange: onEdit });
  const dateToRegistration = register("dateTo", { onChange: onEdit });

  return (
    <Surface>
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 md:flex-row md:items-end"
      >
        <div className="md:flex-1">
          <FormField
            id={DATE_FROM_ID}
            label={t("fields.dateFrom.label")}
            errorMessage={dateFromError && t(dateFromError)}
          >
            <DateField
              id={DATE_FROM_ID}
              latestDate={latestDate}
              isInvalid={dateFromError !== undefined}
              registration={dateFromRegistration}
            />
          </FormField>
        </div>
        <div className="md:flex-1">
          <FormField
            id={DATE_TO_ID}
            label={t("fields.dateTo.label")}
            errorMessage={dateToError && t(dateToError)}
          >
            <DateField
              id={DATE_TO_ID}
              latestDate={latestDate}
              isInvalid={dateToError !== undefined}
              registration={dateToRegistration}
            />
          </FormField>
        </div>
        <Button
          label={t("actions.show")}
          type="submit"
          variant="primary"
          isFullWidth={false}
          isDisabled={!isDirty || isPending}
          isBusy={isPending}
        />
      </form>
    </Surface>
  );
};
