// app/account/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/accountService";
import Account from "../components/Account";


export default async function AccountPage() {
    const session = await getServerSession(authOptions);
    if (!session) {
        redirect("/auth");
    }
    const user = await getUser();
    return (
        <div className="min-h-[90vh] flex items-center justify-center p-4">
            <Account user={user} sessionUser={session.user} />
        </div>
    );
}
