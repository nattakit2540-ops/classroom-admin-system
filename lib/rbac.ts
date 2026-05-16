export const rolePermissions = {
  admin: ["manage:users", "manage:school", "read:all_reports", "export:reports"],
  teacher: ["write:classroom_records", "read:classroom_reports", "export:classroom_reports"],
  executive: ["read:all_reports", "read:analytics", "export:reports"]
} as const;

export type Role = keyof typeof rolePermissions;

export function hasPermission(role: Role, permission: string) {
  return rolePermissions[role].includes(permission as never);
}
