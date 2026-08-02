const ENTRY_SEPARATOR = "; ";
const LOCATION_SEPARATOR = ": ";
const SEGMENT_SEPARATOR = ".";
const SERVER_REJECTED_KEY = "validation:serverRejected";

export type ParsedValidationError = {
  fieldErrors: Record<string, string> | null;
  formError: string | null;
};

export const parseValidationMessage = (message: string): ParsedValidationError => {
  const fieldErrors: Record<string, string> = {};
  let formError: string | null = null;

  for (const entry of message.split(ENTRY_SEPARATOR)) {
    const separatorIndex = entry.indexOf(LOCATION_SEPARATOR);
    const segments =
      separatorIndex === -1 ? [] : entry.slice(0, separatorIndex).split(SEGMENT_SEPARATOR);

    if (segments.length < 2) {
      formError = SERVER_REJECTED_KEY;
      continue;
    }

    fieldErrors[segments.slice(1).join(SEGMENT_SEPARATOR)] = SERVER_REJECTED_KEY;
  }

  return {
    fieldErrors: Object.keys(fieldErrors).length === 0 ? null : fieldErrors,
    formError,
  };
};
