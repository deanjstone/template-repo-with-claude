Scaffold a new Supabase Edge Function.

Ask the user for:
1. **Function name** in kebab-case (e.g. `send-welcome-email`)
2. **Brief description** of what the function does

Then create the following file:

---

**`supabase/functions/<name>/index.ts`**

```ts
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
	// Handle CORS preflight
	if (req.method === "OPTIONS") {
		return new Response(null, { headers: corsHeaders });
	}

	try {
		const body = await req.json();

		// TODO: implement function logic

		return new Response(JSON.stringify({ data: null, error: null }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
			status: 200,
		});
	} catch (error) {
		return new Response(JSON.stringify({ data: null, error: error.message }), {
			headers: { ...corsHeaders, "Content-Type": "application/json" },
			status: 500,
		});
	}
});
```

Also create the shared CORS helper if it does not already exist:

**`supabase/functions/_shared/cors.ts`**

```ts
export const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
```

---

**Local testing:**

```bash
supabase functions serve <name> --env-file .env.local
```

**Deploy:**

```bash
supabase functions deploy <name>
```
