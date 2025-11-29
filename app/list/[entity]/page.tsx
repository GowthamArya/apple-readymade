import GenericListing from "@/app/components/GenericListing";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import { forbidden } from "next/navigation";

export default async function Listing({ params }: { params: Promise<{ entity: string }> }) {
  const session: Session | null = await getServerSession(authOptions);
  const user = session?.user as { role_name?: string } | undefined;
  if (user?.role_name?.toLowerCase() !== 'admin') {
    forbidden();
  }
  const urlParams = new URLSearchParams({
    orderBy: JSON.stringify({ column: "name" })
  });
  const { entity } = await params;
  const entityName = entity;
  const allEntitiesFetch = await fetch(`${process.env.NEXTAUTH_URL}/api/generic/entity?${urlParams}`);
  const allEntities = await allEntitiesFetch.json();
  return <GenericListing entityName={entityName} allEntities={allEntities.data} />
}