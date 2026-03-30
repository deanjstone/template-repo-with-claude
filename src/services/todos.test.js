import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./supabase.js", () => ({
  default: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

import supabase from "./supabase.js";
import { createTodo, deleteTodo, getTodos, updateTodo } from "./todos.js";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getTodos", () => {
  it("returns todos ordered by created_at desc", async () => {
    const todos = [
      { id: "1", title: "First", is_complete: false },
      { id: "2", title: "Second", is_complete: true },
    ];
    const orderMock = vi.fn().mockResolvedValue({ data: todos, error: null });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    supabase.from.mockReturnValue({ select: selectMock });

    const result = await getTodos();

    expect(supabase.from).toHaveBeenCalledWith("todos");
    expect(selectMock).toHaveBeenCalledWith("*");
    expect(orderMock).toHaveBeenCalledWith("created_at", { ascending: false });
    expect(result).toEqual(todos);
  });

  it("throws when supabase returns an error", async () => {
    const orderMock = vi.fn().mockResolvedValue({ data: null, error: new Error("DB error") });
    const selectMock = vi.fn().mockReturnValue({ order: orderMock });
    supabase.from.mockReturnValue({ select: selectMock });

    await expect(getTodos()).rejects.toThrow("DB error");
  });
});

describe("createTodo", () => {
  it("inserts a todo with the current user id and returns it", async () => {
    const user = { id: "user-123" };
    supabase.auth.getUser.mockResolvedValue({ data: { user } });

    const created = { id: "todo-1", title: "Buy milk", user_id: user.id, is_complete: false };
    const singleMock = vi.fn().mockResolvedValue({ data: created, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });
    supabase.from.mockReturnValue({ insert: insertMock });

    const result = await createTodo("Buy milk");

    expect(supabase.from).toHaveBeenCalledWith("todos");
    expect(insertMock).toHaveBeenCalledWith({ title: "Buy milk", user_id: user.id });
    expect(singleMock).toHaveBeenCalled();
    expect(result).toEqual(created);
  });

  it("throws when insert fails", async () => {
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: "u1" } } });
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: new Error("Insert failed") });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const insertMock = vi.fn().mockReturnValue({ select: selectMock });
    supabase.from.mockReturnValue({ insert: insertMock });

    await expect(createTodo("Bad todo")).rejects.toThrow("Insert failed");
  });
});

describe("updateTodo", () => {
  it("updates a todo by id and returns the updated record", async () => {
    const updated = { id: "todo-1", title: "Buy milk", is_complete: true };
    const singleMock = vi.fn().mockResolvedValue({ data: updated, error: null });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const eqMock = vi.fn().mockReturnValue({ select: selectMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ update: updateMock });

    const result = await updateTodo("todo-1", { is_complete: true });

    expect(supabase.from).toHaveBeenCalledWith("todos");
    expect(updateMock).toHaveBeenCalledWith({ is_complete: true });
    expect(eqMock).toHaveBeenCalledWith("id", "todo-1");
    expect(singleMock).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });

  it("throws when update fails", async () => {
    const singleMock = vi.fn().mockResolvedValue({ data: null, error: new Error("Update failed") });
    const selectMock = vi.fn().mockReturnValue({ single: singleMock });
    const eqMock = vi.fn().mockReturnValue({ select: selectMock });
    const updateMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ update: updateMock });

    await expect(updateTodo("todo-1", { is_complete: true })).rejects.toThrow("Update failed");
  });
});

describe("deleteTodo", () => {
  it("deletes a todo by id", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: null });
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ delete: deleteMock });

    await deleteTodo("todo-1");

    expect(supabase.from).toHaveBeenCalledWith("todos");
    expect(deleteMock).toHaveBeenCalled();
    expect(eqMock).toHaveBeenCalledWith("id", "todo-1");
  });

  it("throws when delete fails", async () => {
    const eqMock = vi.fn().mockResolvedValue({ error: new Error("Delete failed") });
    const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });
    supabase.from.mockReturnValue({ delete: deleteMock });

    await expect(deleteTodo("todo-1")).rejects.toThrow("Delete failed");
  });
});
