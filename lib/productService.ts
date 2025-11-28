
import { fetchWithRelations } from "@/lib/supabase";

export async function getProduct({ searchQuery, category, sortBy = 'created_on', sortOrder = 'desc', page = 1, pageSize = 20 }: any) {
  let query = fetchWithRelations("variant", ["product.category"])
    .eq("is_default", true);

  if (searchQuery) {
    query = query.ilike("product.name", `%${searchQuery}%`);
  }

  if (category) {
    // Assuming category filtering works by joining product.category.name or similar. 
    // Since fetchWithRelations uses !inner for nested joins, we can filter on the joined table.
    query = query.ilike("product.category.name", `%${category}%`);
  }

  // Sorting
  if (sortBy === 'price') {
    query = query.order('price', { ascending: sortOrder === 'asc' });
  } else if (sortBy === 'mrp') {
    query = query.order('mrp', { ascending: sortOrder === 'asc' });
  } else {
    query = query.order('created_on', { ascending: sortOrder === 'asc' });
  }

  // Pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error(error.message);
    return { data: [], totalCount: 0 };
  }

  return { data: data || [], totalCount: count || 0 };
}

export async function getAllCategories() {
  const { data, error } = await fetchWithRelations("category")
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }

  return data || [];
}