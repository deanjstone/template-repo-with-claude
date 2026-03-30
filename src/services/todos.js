import supabase from "./supabase.js";

export async function getTodos() {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function createTodo(title) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("todos")
    .insert({ title, user_id: user.id })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTodo(id, updates) {
  const { data, error } = await supabase
    .from("todos")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTodo(id) {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw error;
}
