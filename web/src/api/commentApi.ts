import { ENDPOINTS } from "@/constants/endpoints";
import type { CommentDto, CommentWrite } from "@/types/comment";
import type { PageRequest } from "@/types/pagination";

import { httpClient } from "./httpClient";

export const commentApi = {
  list: async (postId: number, request: PageRequest): Promise<CommentDto[]> => {
    const { data } = await httpClient.get<CommentDto[]>(ENDPOINTS.postComments(postId), {
      params: request,
    });
    return data;
  },
  create: async (postId: number, body: CommentWrite): Promise<CommentDto> => {
    const { data } = await httpClient.post<CommentDto>(
      ENDPOINTS.postComments(postId),
      body,
    );
    return data;
  },
  update: async (commentId: number, body: CommentWrite): Promise<CommentDto> => {
    const { data } = await httpClient.put<CommentDto>(ENDPOINTS.comment(commentId), body);
    return data;
  },
  remove: async (commentId: number): Promise<void> => {
    await httpClient.delete(ENDPOINTS.comment(commentId));
  },
};
