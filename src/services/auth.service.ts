import { api } from "./api";
import type { User } from "@/types";

interface BackendUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: "admin" | "user";
  isVerified: boolean;
  createdAt: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  user: BackendUser;
}

const mapUser = (user: BackendUser): User => ({
  id: user.id,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  phone: user.phone || "",
  avatar: user.avatar || "",
  addresses: [],
  createdAt: user.createdAt,
  role: user.role === "admin" ? "admin" : "customer",
  isVerified: user.isVerified,
});

export const authService = {
  async login(email: string, password: string) {
    const { data } = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });

    localStorage.setItem("revvano-token", data.token);

    return {
      token: data.token,
      user: mapUser(data.user),
    };
  },

  async register(
  firstName: string,
  lastName: string,
  email: string,
  password: string
) {
  const { data } = await api.post("/auth/register", {
    firstName,
    lastName,
    email,
    password,
  });

  localStorage.setItem("revvano-token", data.token);

  return {
    token: data.token,
    user: mapUser(data.user),
  };
},

  async getProfile() {
    const { data } = await api.get<{
      success: boolean;
      user: BackendUser;
    }>("/auth/me");

    return mapUser(data.user);
  },

  async forgotPassword(email: string) {
    const { data } = await api.post<{ success: boolean; message: string }>(
      "/auth/forgot-password",
      { email }
    );
    return data;
  },

  async verifyOtp(email: string, otp: string) {
    const { data } = await api.post<{ success: boolean; message: string; resetToken: string }>(
      "/auth/verify-otp",
      { email, otp }
    );
    return data;
  },

  async resetPassword(email: string, resetToken: string, newPassword: string) {
    const { data } = await api.post<{ success: boolean; message: string }>(
      "/auth/reset-password",
      { email, resetToken, newPassword }
    );
    return data;
  },

  async loginWithGoogle(idToken: string) {
    const { data } = await api.post<LoginResponse>("/auth/google", { idToken });

    localStorage.setItem("revvano-token", data.token);

    return {
      token: data.token,
      user: mapUser(data.user),
    };
  },

  logout() {
    localStorage.removeItem("revvano-token");
  },
};