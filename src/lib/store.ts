import type { UserRequirements, MatchResult } from "@/types";

const REQUIREMENTS_KEY = "dreamhome_requirements";
const SAVED_KEY = "dreamhome_saved";
const COMPARE_KEY = "dreamhome_compare";
const MATCHES_KEY = "dreamhome_matches";
const SPEC_KEY = "dreamhome_spec";

export function saveRequirements(req: UserRequirements) {
  try {
    localStorage.setItem(REQUIREMENTS_KEY, JSON.stringify(req));
  } catch {}
}

export function loadRequirements(): UserRequirements | null {
  try {
    const raw = localStorage.getItem(REQUIREMENTS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveMatches(matches: MatchResult[]) {
  try {
    localStorage.setItem(MATCHES_KEY, JSON.stringify(matches));
  } catch {}
}

export function loadMatches(): MatchResult[] {
  try {
    const raw = localStorage.getItem(MATCHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function getSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleSaved(id: string): string[] {
  const current = getSavedIds();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function getCompareIds(): string[] {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleCompare(id: string): string[] {
  const current = getCompareIds();
  let next: string[];
  if (current.includes(id)) {
    next = current.filter((x) => x !== id);
  } else if (current.length >= 3) {
    next = [...current.slice(1), id];
  } else {
    next = [...current, id];
  }
  try {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(next));
  } catch {}
  return next;
}

export function saveSpec(spec: unknown) {
  try {
    localStorage.setItem(SPEC_KEY, JSON.stringify(spec));
  } catch {}
}

export function loadSpec() {
  try {
    const raw = localStorage.getItem(SPEC_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
