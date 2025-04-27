import {
  AuthActionResponse,
  AuthProvider,
  CheckResponse,
  IdentityResponse,
  OnErrorResponse,
  PermissionResponse,
} from "@refinedev/core";

import Parse from "parse";

export const authProvider: AuthProvider = {
  login: async ({ email, password }): Promise<AuthActionResponse> => {
    try {
      const user = await Parse.User.logIn(email, password);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user.toJSON()));
        return { success: true };
      }
    } catch (error) {
      return { success: false, error };
    }
    return undefined;
  },

  register: async ({
    email,
    password,
    ...rest
  }: Record<string, any>): Promise<AuthActionResponse> => {
    try {
      const user = new Parse.User();

      // required fields
      user.set("username", email); // Parse requires a username
      user.set("email", email);
      user.set("password", password);

      // optional extra fields (e.g. firstName, role, etc.)
      Object.entries(rest).forEach(([key, value]) => user.set(key, value));

      await user.signUp(); // throws if email already taken, weak pwd, etc.

      localStorage.setItem("user", JSON.stringify(user.toJSON()));
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  logout: async (): Promise<AuthActionResponse> => {
    try {
      await Parse.User.logOut();
      localStorage.removeItem("user");
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  },

  check: async (): Promise<CheckResponse> => {
    const user = localStorage.getItem("user");
    return user
      ? { authenticated: true }
      : {
          authenticated: false,
          error: {
            message: "User not authenticated",
            name: "NotAuthenticated",
          },
        };
  },

  onError: async (error): Promise<OnErrorResponse> => {
    if (error?.status === 209) {
      // Invalid session token
      return { redirectTo: "/login" };
    }
    return {};
  },

  getPermissions: async (): Promise<PermissionResponse> => {
    const user = Parse.User.current();
    if (user) {
      return { permissions: user.get("role") };
    }
    return { permissions: null };
  },

  getIdentity: async (): Promise<IdentityResponse> => {
    const user = Parse.User.current();
    if (user) {
      return user;
    }
    return null;
  },
};
