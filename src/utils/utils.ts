
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to handle Excel opening attempt (separate from export)
export function attemptOpenExcel(url: string) {
  try {
    const excelUrl = `ms-excel:ofe|u|${url}`;
    window.location.href = excelUrl;
    console.log("Tentativa de abrir Excel automaticamente");
    return true;
  } catch (error) {
    console.error("Falha ao tentar abrir Excel:", error);
    return false;
  }
}
