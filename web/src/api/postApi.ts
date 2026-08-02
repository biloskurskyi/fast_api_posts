import { ENDPOINTS } from "@/constants/endpoints";
import type { PageRequest } from "@/types/pagination";
import type { PostDto, PostWrite } from "@/types/post";

import { httpClient } from "./httpClient";

export const postApi = {
  list: async (request: PageRequest): Promise<PostDto[]> => {
    const { data } = await httpClient.get<PostDto[]>(ENDPOINTS.posts, {
      params: request,
    });
    return data;
  },
  get: async (postId: number): Promise<PostDto> => {
    const { data } = await httpClient.get<PostDto>(ENDPOINTS.post(postId));
    return data;
  },
  create: async (body: PostWrite): Promise<PostDto> => {
    const { data } = await httpClient.post<PostDto>(ENDPOINTS.posts, body);
    return data;
  },
  update: async (postId: number, body: PostWrite): Promise<PostDto> => {
    const { data } = await httpClient.put<PostDto>(ENDPOINTS.post(postId), body);
    return data;
  },
  remove: async (postId: number): Promise<void> => {
    await httpClient.delete(ENDPOINTS.post(postId));
  },
};
