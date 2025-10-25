import GenericListing from "@/app/components/GenericListing";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { forbidden } from "next/navigation";

export default async function Listing(props: PageProps<"/list/[entity]">) {
  const {user}:any = await getServerSession(authOptions);
  console.log({user});
  if(user?.role_name?.toLowerCase() !== 'admin'){
    forbidden();
  }
  const entityName = (await (await props).params).entity;
  const allEntitiesFetch = await fetch(`${process.env.NEXTAUTH_URL}/api/generic/entity`);
  const allEntities = await allEntitiesFetch.json();
  return <GenericListing entityName={entityName} allEntities={allEntities.data}/>
}