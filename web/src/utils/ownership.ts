export const isOwnedBy = (ownerId: number, viewerId: number | null): boolean =>
  viewerId !== null && ownerId === viewerId;
