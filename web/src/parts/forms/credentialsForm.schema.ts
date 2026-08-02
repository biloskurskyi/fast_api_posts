import { z } from "zod";

import { LIMITS } from "@/constants/limits";
import type { Credentials } from "@/types/session";
import { byteLength } from "@/utils/byteLength";

const CREDENTIAL_FIELD_NAMES = ["username", "password"] as const;

export type CredentialFieldName = (typeof CREDENTIAL_FIELD_NAMES)[number];

const credentialFieldNames: readonly string[] = CREDENTIAL_FIELD_NAMES;

export const isCredentialFieldName = (field: string): field is CredentialFieldName =>
  credentialFieldNames.includes(field);

export const credentialsFormSchema = z.object({
  username: z
    .string()
    .min(LIMITS.username.min, "validation:usernameLength")
    .max(LIMITS.username.max, "validation:usernameLength")
    .regex(LIMITS.username.pattern, "validation:usernamePattern"),
  password: z
    .string()
    .min(LIMITS.password.min, "validation:passwordLength")
    .max(LIMITS.password.max, "validation:passwordLength")
    .refine((password) => byteLength(password) <= LIMITS.password.maxBytes, {
      message: "validation:passwordBytes",
    }),
});

export type CredentialsFormValues = z.infer<typeof credentialsFormSchema>;

export const createCredentialsFormDefaults = (): Credentials => ({
  username: "",
  password: "",
});
