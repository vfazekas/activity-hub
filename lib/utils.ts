import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//PROVIDERS

 export function getInitial(name: string) {
    return name.charAt(0).toUpperCase();
  }

 export function getProviderColor(name: string) {
    const colors = [
      "bg-blue-600",
      "bg-violet-600",
      "bg-emerald-600",
      "bg-orange-600",
      "bg-cyan-600",
      "bg-pink-600",
    ];

  const index =
      name
        .split("")
        .reduce((total, character) => total + character.charCodeAt(0), 0) %
      colors.length;

    return colors[index];
  }


  export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDueDate(value: string | null) {
  if (!value) {
    return "Sem prazo";
  }

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("pt-BR").format(date);
}