import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./supabase.js", () => ({
  default: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

import { getSession, onAuthStateChange, signIn, signOut, signUp } from "./auth.js";
import supabase from "./supabase.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("signUp", () => {
  it("calls supabase.auth.signUp with email and password", async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { user: { id: "123" } }, error: null });
    const result = await signUp("test@example.com", "password123");
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(result).toEqual({ user: { id: "123" } });
  });

  it("throws when supabase returns an error", async () => {
    const err = new Error("Email already registered");
    supabase.auth.signUp.mockResolvedValue({ data: null, error: err });
    await expect(signUp("test@example.com", "password123")).rejects.toThrow(
      "Email already registered"
    );
  });
});

describe("signIn", () => {
  it("calls supabase.auth.signInWithPassword with email and password", async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: { session: { access_token: "tok" } },
      error: null,
    });
    const result = await signIn("test@example.com", "password123");
    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
    expect(result).toEqual({ session: { access_token: "tok" } });
  });

  it("throws when credentials are invalid", async () => {
    const err = new Error("Invalid login credentials");
    supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: err });
    await expect(signIn("test@example.com", "wrong")).rejects.toThrow("Invalid login credentials");
  });
});

describe("signOut", () => {
  it("calls supabase.auth.signOut", async () => {
    supabase.auth.signOut.mockResolvedValue({ error: null });
    await signOut();
    expect(supabase.auth.signOut).toHaveBeenCalledOnce();
  });

  it("throws when sign-out fails", async () => {
    const err = new Error("Sign out failed");
    supabase.auth.signOut.mockResolvedValue({ error: err });
    await expect(signOut()).rejects.toThrow("Sign out failed");
  });
});

describe("getSession", () => {
  it("returns the session when one exists", async () => {
    const session = { access_token: "tok", user: { id: "123" } };
    supabase.auth.getSession.mockResolvedValue({ data: { session }, error: null });
    const result = await getSession();
    expect(result).toEqual(session);
  });

  it("returns null when no session exists", async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    const result = await getSession();
    expect(result).toBeNull();
  });

  it("returns null when supabase returns an error", async () => {
    supabase.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: new Error("Network error"),
    });
    const result = await getSession();
    expect(result).toBeNull();
  });

  it("returns null when supabase throws", async () => {
    supabase.auth.getSession.mockRejectedValue(new Error("Unexpected error"));
    const result = await getSession();
    expect(result).toBeNull();
  });
});

describe("onAuthStateChange", () => {
  it("subscribes to auth state changes and returns the subscription", () => {
    const unsubscribe = vi.fn();
    supabase.auth.onAuthStateChange.mockReturnValue({
      data: { subscription: { unsubscribe } },
    });
    const callback = vi.fn();
    const subscription = onAuthStateChange(callback);
    expect(supabase.auth.onAuthStateChange).toHaveBeenCalledOnce();
    expect(subscription).toEqual({ unsubscribe });
  });

  it("calls the callback when auth state changes", () => {
    const session = { user: { id: "123" } };
    supabase.auth.onAuthStateChange.mockImplementation((cb) => {
      cb("SIGNED_IN", session);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
    const callback = vi.fn();
    onAuthStateChange(callback);
    expect(callback).toHaveBeenCalledWith(session);
  });
});
