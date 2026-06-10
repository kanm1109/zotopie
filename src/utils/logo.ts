export const LOGO_PALETTE = [
  '#2563eb', '#7c3aed', '#059669',
  '#dc2626', '#d97706', '#0891b2',
  '#be185d', '#16a34a',
] as const;

export interface LogoTool {
  name: string;
  slug: string;
  simple_icon?: string;
}

export function getInitials(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();
}

export function getAvatarColor(slug: string): string {
  return LOGO_PALETTE[slug.charCodeAt(0) % LOGO_PALETTE.length];
}
