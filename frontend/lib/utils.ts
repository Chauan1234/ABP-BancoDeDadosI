import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  try { return String(err); } catch { return "Erro desconhecido"; }
}
