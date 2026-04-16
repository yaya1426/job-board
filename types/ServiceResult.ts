export type ServiceResult<T> =
  | { success: true; data?: T }
  | { success: false; errors?: Record<string, string[]> };
