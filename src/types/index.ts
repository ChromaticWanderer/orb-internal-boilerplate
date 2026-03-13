/** Re-export auth types for convenience */
export type { AuthUser, AuthResult } from "@/lib/auth/workos-auth";

/** Navigation item for sidebar */
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ElementType;
  disabled?: boolean;
  children?: NavItem[];
}

/** Generic API response wrapper */
export interface ApiResponse<T = unknown> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** Paginated response */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Sort direction */
export type SortDirection = "asc" | "desc";

/** Column sort state */
export interface SortState {
  column: string;
  direction: SortDirection;
}
