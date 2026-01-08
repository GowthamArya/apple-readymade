import supabase, { fetchWithRelations } from "@/lib/supabase";
import { generateEmbedding } from "./gemini";

export async function getProduct({ searchQuery, category, sortBy = 'created_on', sortOrder = 'desc', page = 1, pageSize = 20 }: any) {
  let query = fetchWithRelations("variant", ["product.category"])
    .eq("is_default", true);

  // Vector Search Integration
  if (searchQuery) {
    try {
      const embedding = await generateEmbedding(searchQuery);
      const { data: similarVariants, error: matchError } = await supabase.rpc('match_variants', {
        query_embedding: embedding,
        match_threshold: 0.5, // Adjust threshold as needed
        match_count: pageSize
      });

      if (!matchError && similarVariants && similarVariants.length > 0) {
        const variantIds = similarVariants.map((v: any) => v.id);
        // We use the IDs from vector search to filter the main query
        // Note: This might lose the specific order from vector search unless we handle it explicitly.
        // For simplicity, we filter by these IDs.
        query = fetchWithRelations("variant", ["product.category"])
          .in('id', variantIds)
          .eq("is_default", true);
      } else {
        // Fallback to keyword search if vector search fails or returns nothing
        query = query.ilike("product.name", `%${searchQuery}%`);
      }
    } catch (e) {
      console.error("Vector search failed, falling back to keyword search", e);
      query = query.ilike("product.name", `%${searchQuery}%`);
    }
  } else {
    // If no search query, apply category filter if present
    if (category) {
      query = query.ilike("product.category.name", `%${category}%`);
    }
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

export async function getSimilarVariants(variantId: number) {
  try {
    // 1. Get the embedding of the current variant
    const { data: currentVariant, error: fetchError } = await supabase
      .from('variant')
      .select('embedding')
      .eq('id', variantId)
      .single();

    if (fetchError || !currentVariant?.embedding) {
      console.log("Could not fetch embedding for variant", currentVariant);
      return [];
    }

    // 2. Find similar variants
    const { data: similarVariants, error: matchError } = await supabase.rpc('match_variants', {
      query_embedding: currentVariant.embedding,
      match_threshold: 0.6,
      match_count: 5
    });

    if (matchError) {
      console.error("Error matching variants", matchError);
      return [];
    }

    // 3. Fetch full details for these variants
    const variantIds = similarVariants.map((v: any) => v.id).filter((id: number) => id !== variantId);

    if (variantIds.length === 0) return [];

    const { data, error } = await fetchWithRelations("variant", ["product.category"])
      .in('id', variantIds);

    if (error) {
      console.error("Error fetching similar variant details", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in getSimilarVariants", error);
    return [];
  }
}

export async function getCartDetails(variantIds: number[]) {
  if (!variantIds || variantIds.length === 0) return [];

  const { data, error } = await fetchWithRelations("variant", ["product"])
    .in('id', variantIds);

  if (error) {
    console.error("Error fetching cart details:", error);
    return [];
  }

  return data || [];
}