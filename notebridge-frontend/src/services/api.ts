const API_BASE_URL = 'http://localhost:8000';

export interface User {
  id: number;
  email: string;
  full_name?: string;
  department?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export const NWU_EMAIL_REGEX = /^\d{11}@nwu\.ac\.bd$/;
export const NWU_ERROR_MESSAGE = "Please enter a valid NWU student email (e.g., 20242087010@nwu.ac.bd).";

export async function registerApi(
  email: string,
  password: string,
  fullName?: string,
  department?: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
      full_name: fullName?.trim() || undefined,
      department: department?.trim() || undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Registration failed');
  }

  return data;
}

export async function loginApi(
  email: string,
  password: string,
  department?: string
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: email.trim(),
      password,
      department: department?.trim() || undefined,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Login failed');
  }

  return data;
}

export async function getMeApi(token: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || 'Failed to get user profile');
  }

  return data;
}
