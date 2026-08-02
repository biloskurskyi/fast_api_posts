export type AutoReplySettingsDto = {
  auto_reply_enabled: boolean;
  auto_reply_text: string;
  auto_reply_delay_seconds: number;
};

export type AutoReplySettings = {
  isEnabled: boolean;
  text: string;
  delaySeconds: number;
};

export type DelayPhraseKey = "immediately" | "minutes" | "hours" | "hoursAndMinutes";

export type DelayPhrase = {
  key: DelayPhraseKey;
  count: number;
  hours: number;
  minutes: number;
};
