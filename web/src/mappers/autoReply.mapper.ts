import type {
  AutoReplySettings,
  AutoReplySettingsDto,
  DelayPhrase,
} from "@/types/autoReply";

const SECONDS_PER_MINUTE = 60;
const MINUTES_PER_HOUR = 60;

export const toAutoReplySettings = (dto: AutoReplySettingsDto): AutoReplySettings => ({
  isEnabled: dto.auto_reply_enabled,
  text: dto.auto_reply_text,
  delaySeconds: dto.auto_reply_delay_seconds,
});

export const toAutoReplySettingsDto = (
  settings: AutoReplySettings,
): AutoReplySettingsDto => ({
  auto_reply_enabled: settings.isEnabled,
  auto_reply_text: settings.text.trim(),
  auto_reply_delay_seconds: settings.delaySeconds,
});

export const toDelayPhrase = (delaySeconds: number): DelayPhrase => {
  const totalMinutes = Math.round(delaySeconds / SECONDS_PER_MINUTE);
  const hours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
  const minutes = totalMinutes % MINUTES_PER_HOUR;

  if (totalMinutes === 0) return { key: "immediately", count: 0, hours, minutes };
  if (hours === 0) return { key: "minutes", count: minutes, hours, minutes };
  if (minutes === 0) return { key: "hours", count: hours, hours, minutes };
  return { key: "hoursAndMinutes", count: hours, hours, minutes };
};
