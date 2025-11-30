import { NextResponse } from "next/server";
import supabase, { fetchWithRelations, uploadVariantFileToStorage } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    const user = await fetchWithRelations('user').eq('email', session?.user?.email).single();
    if (user.error) {
        return NextResponse.json({ error: user.error.message }, { status: 500 });
    }
    return NextResponse.json(user.data);    
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, phone, age } = body;

    const { data: existingUser, error } = await fetchWithRelations("user")
      .eq("email", session.user.email)
      .single();

    if (error && error.code !== "PGRST116") { // Not "no rows"
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!existingUser) {
      const { data, error: insertError } = await supabase.from("user").insert({
        email: session.user.email,
        name,
        phone,
        age,
      }).select().single();

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({ message: "User created", user: data });
    }

    // If user exists, update them
    const { data: updatedUser, error: updateError } = await supabase
      .from("user")
      .update({ name, phone, age })
      .eq("email", session.user.email)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ message: "User updated", user: updatedUser });
  } catch (err) {
    console.error("PUT /api/user/update error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
