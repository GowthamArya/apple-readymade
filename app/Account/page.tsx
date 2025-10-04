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
        <div className="min-h-screen bg-green-50 flex items-center justify-center flex-col">
            {session.user?.image && 
            <img 
                src={session.user?.image} 
                alt="Profile" 
                width={75} 
                height={75} 
                loading="lazy"
                className="rounded-full mt-4"
            />}
            <h1 className="text-xl font-bold">Welcome, {session.user?.name}!</h1>
            <p className="text-gray-500">{session.user?.email}</p>
            <Account user={user} />
        </div>
    );
}
