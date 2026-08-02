import { z } from "zod";

import { LIMITS } from "@/constants/limits";

export const postFormSchema = z.object({
  title: z
    .string()
    .max(LIMITS.postTitle.max, "validation:postTitleLength")
    .refine((title) => title.trim().length >= LIMITS.postTitle.min, {
      message: "validation:postTitleRequired",
    }),
  content: z
    .string()
    .max(LIMITS.postContent.max, "validation:postContentLength")
    .refine((content) => content.trim().length >= LIMITS.postContent.min, {
      message: "validation:postContentRequired",
    }),
});

export type PostFormValues = z.infer<typeof postFormSchema>;
