export const cn = (...classNames: (string | false | null | undefined)[]): string =>
  classNames.filter(Boolean).join(" ");
