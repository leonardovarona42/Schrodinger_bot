import { Role } from "@schrodinger/shared"

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 5,
  OWNER: 4,
  ADMIN: 3,
  MODERATOR: 2,
  VIEWER: 1,
}

export const ADMIN_ROLES: Role[] = ["SUPER_ADMIN", "OWNER", "ADMIN"]
export const MODERATOR_ROLES: Role[] = [...ADMIN_ROLES, "MODERATOR"]

export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function isAdmin(role: Role): boolean {
  return ADMIN_ROLES.includes(role)
}

export function isModerator(role: Role): boolean {
  return MODERATOR_ROLES.includes(role)
}

export const PERMISSIONS = {
  VIEW_DASHBOARD: MODERATOR_ROLES,
  MANAGE_GROUPS: MODERATOR_ROLES,
  VIEW_LOGS: MODERATOR_ROLES,
  VIEW_ANALYTICS: MODERATOR_ROLES,
  MANAGE_POLICIES: MODERATOR_ROLES,
  MANAGE_INTEGRATIONS: ADMIN_ROLES,
  MANAGE_SETTINGS: ADMIN_ROLES,
  MANAGE_USERS: ADMIN_ROLES,
} as const

export type Permission = keyof typeof PERMISSIONS

export function hasPermission(role: Role, permission: Permission): boolean {
  return PERMISSIONS[permission].includes(role)
}
