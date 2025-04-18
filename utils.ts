import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  // Format currency in Indian Rupee format with commas (e.g., ₹1,75,000)
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  });
  
  return formatter.format(amount);
}

export function formatNumber(value: number): string {
  // Format general numbers with commas for thousands (e.g., 1,234)
  return new Intl.NumberFormat('en-IN').format(value);
}

export function calculateDays(startDate: Date, endDate: Date): number {
  // Calculate the difference in days between two dates
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function calculateTotalAmount(dailyRate: number, days: number): number {
  return dailyRate * days;
}

export function isObjectEmpty(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export function getCarBrands(): string[] {
  return [
    "All",
    "Lamborghini",
    "Ferrari",
    "McLaren",
    "Porsche",
    "Aston Martin",
    "Audi",
    "Bugatti"
  ];
}

export function getAvailabilityText(isAvailable: boolean): string {
  return isAvailable ? "Available" : "Booked";
}

export function getAvailabilityColor(isAvailable: boolean): string {
  return isAvailable ? "text-[hsl(var(--available))]" : "text-[hsl(var(--unavailable))]";
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
