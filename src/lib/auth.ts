export type UserRole = "visitor" | "agent" | "developer";

export interface MockUser {
  id: string;
  name: string;
  role: UserRole;
  company?: string;
  phone?: string;
}

const AUTH_KEY = "dreamhome_auth";

export function getCurrentUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function loginAs(role: "agent" | "developer"): MockUser {
  const user: MockUser =
    role === "agent"
      ? {
          id: "user-agent-01",
          name: "Chioma Okoro",
          role: "agent",
          company: "Lekki Homes Realty",
          phone: "+234 803 123 4567",
        }
      : {
          id: "user-dev-01",
          name: "Emeka Nwosu",
          role: "developer",
          company: "Horizon Developers Ltd",
          phone: "+234 701 222 3333",
        };

  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}