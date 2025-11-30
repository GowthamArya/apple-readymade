import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';
import { generateEmbedding } from '@/lib/gemini';

export async function GET() {
    try {
        // 1. Fetch variants without embeddings
        const { data: variants, error } = await supabase
            .from('variant')
            .select('id, product(name, description, category(name)), color, size, sku')
            .is('embedding', null)
            .limit(50); // Process in batches

        if (error) throw error;

        if (!variants || variants.length === 0) {
            return NextResponse.json({ message: 'No variants to process' });
        }

        let processed = 0;
        for (const variant of variants) {
            // Construct text for embedding
            // Combine product name, description, category, color, size
            const product = Array.isArray(variant.product) ? (variant.product as any)[0] : (variant.product as any);
            const category = product?.category;
            const categoryName = Array.isArray(category) ? category[0]?.name : category?.name;

            const text = `
        ${product?.name || ''} 
        ${product?.description || ''} 
        Category: ${categoryName || ''} 
        Color: ${variant.color || ''} 
        Size: ${variant.size || ''}
      `.trim().replace(/\s+/g, ' ');

            if (text) {
                const embedding = await generateEmbedding(text);

                const { error: updateError } = await supabase
                    .from('variant')
                    .update({ embedding })
                    .eq('id', variant.id);

                if (updateError) {
                    console.error(`Failed to update variant ${variant.id}`, updateError);
                } else {
                    processed++;
                }
            }
        }

        return NextResponse.json({
            message: `Processed ${processed} variants`,
            remaining: variants.length - processed
        });

    } catch (error) {
        console.error('Error generating embeddings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
