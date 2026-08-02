import { z } from "zod";

import { LIMITS } from "@/constants/limits";
import type { CommentWrite } from "@/types/comment";

export const commentFormSchema = z.object({
  info: z
    .string()
    .max(LIMITS.commentInfo.max, "validation:commentLength")
    .refine((info) => info.trim().length >= LIMITS.commentInfo.min, {
      message: "validation:commentRequired",
    }),
});

export type CommentFormValues = z.infer<typeof commentFormSchema>;

export const createCommentFormDefaults = (info: string): CommentWrite => ({ info });
