import GenericListing from "@/app/components/GenericListing";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import { forbidden } from "next/navigation";

export default async function Listing(props: PageProps<"/list/[entity]">) {
  const session: Session | null = await getServerSession(authOptions);
  const user = session?.user as { role_name?: string } | undefined;
  if(user?.role_name?.toLowerCase() !== 'admin'){
    forbidden();
  }
  const params = new URLSearchParams({
      orderBy: JSON.stringify({ column: "name" })
    });
  const entityName = (await (await props).params).entity;
  const allEntitiesFetch = await fetch(`${process.env.NEXTAUTH_URL}/api/generic/entity?${params}`);
  const allEntities = await allEntitiesFetch.json();
  return <GenericListing entityName={entityName} allEntities={allEntities.data}/>
}