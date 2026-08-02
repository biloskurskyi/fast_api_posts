import { z } from "zod";

import { LIMITS } from "@/constants/limits";
import type { AutoReplySettings } from "@/types/autoReply";

export const autoReplySettingsFormSchema = z
  .object({
    isEnabled: z.boolean(),
    text: z.string().max(LIMITS.autoReplyText.max, "validation:autoReplyTextLength"),
    delaySeconds: z
      .number()
      .int()
      .min(LIMITS.autoReplyDelaySeconds.min, "validation:autoReplyDelayRange")
      .max(LIMITS.autoReplyDelaySeconds.max, "validation:autoReplyDelayRange"),
  })
  .refine((values) => !values.isEnabled || values.text.trim() !== "", {
    message: "validation:autoReplyTextRequired",
    path: ["text"],
  });

export type AutoReplyFormValues = z.infer<typeof autoReplySettingsFormSchema>;

export const createAutoReplyFormDefaults = (
  settings: AutoReplySettings,
): AutoReplyFormValues => ({
  isEnabled: settings.isEnabled,
  text: settings.text,
  delaySeconds: settings.delaySeconds,
});
