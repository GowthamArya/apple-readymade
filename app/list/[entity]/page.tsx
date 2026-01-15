import GenericListing from "@/app/components/GenericListing";
import GenericRepo from "@/utils/supabase/genericRepo";
import { authOptions } from "@/lib/auth";
import { getServerSession, Session } from "next-auth";
import { forbidden } from "next/navigation";

export default async function Listing({ params }: { params: Promise<{ entity: string }> }) {
  const session: Session | null = await getServerSession(authOptions);
  const user = session?.user as { role_name?: string } | undefined;
  if (user?.role_name?.toLowerCase() !== 'admin') {
    forbidden();
  }
  const { entity } = await params;
  const entityName = entity;

  const allEntities = await GenericRepo.fetchAll("entity", undefined, {
    orderBy: { column: "name" }
  });
  return <GenericListing entityName={entityName} allEntities={allEntities.data} />
}