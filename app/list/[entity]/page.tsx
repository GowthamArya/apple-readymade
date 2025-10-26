import GenericListing from "@/app/components/GenericListing";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { forbidden } from "next/navigation";

export default async function Listing(props: PageProps<"/list/[entity]">) {
  const {user}:any = await getServerSession(authOptions);
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