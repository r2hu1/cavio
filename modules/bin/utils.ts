import { addDays, differenceInDays, formatDistanceToNow } from "date-fns";
import { AUTO_DELETE_DAYS } from "./constants";

export function parseDate(dateValue: string | Date | null): Date | null {
	if (!dateValue) return null;
	if (dateValue instanceof Date) return dateValue;
	try {
		return new Date(dateValue);
	} catch {
		return null;
	}
}

export function getDaysRemaining(deletedAt: string | Date | null): number {
	const date = parseDate(deletedAt);
	if (!date) return AUTO_DELETE_DAYS;
	const deleteDate = addDays(date, AUTO_DELETE_DAYS);
	const daysLeft = differenceInDays(deleteDate, new Date());
	return Math.max(0, daysLeft);
}

export function formatDeletedDate(deletedAt: string | Date | null): string {
	const date = parseDate(deletedAt);
	if (!date) return "Unknown";
	try {
		return formatDistanceToNow(date, { addSuffix: true });
	} catch {
		return "Unknown";
	}
}
