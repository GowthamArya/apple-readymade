import supabase, { fetchWithRelations, uploadVariantFileToStorage } from "@/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function getUser() {
    const session = await getServerSession(authOptions);
    const user = await fetchWithRelations('user').eq('email', session?.user?.email).single();

    if (user.error) {
        return { message: user.error.message , status: 500 };
    }
    return user.data;
}