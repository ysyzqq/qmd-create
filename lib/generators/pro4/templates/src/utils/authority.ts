let permissions: string[];

export function getAuthority(): string[] {
  return permissions;
}

export function setAuthority(authority: string | string[]): void {
  const proAuthority = typeof authority === 'string' ? [authority] : authority;
  permissions = [...proAuthority];
}
