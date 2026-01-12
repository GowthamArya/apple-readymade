import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const { enhanceProductImage } = await import('@/lib/imageProcessor');
        const processedBuffer = await enhanceProductImage(fileBuffer);

        const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '_').replace(/\.[^/.]+$/, "") + ".png"; // Ensure PNG extension
        const fileName = `notifications/${Date.now()}_${sanitizedFileName}`;

        const { error } = await supabase.storage
            .from('apple')
            .upload(fileName, processedBuffer, {
                contentType: 'image/png',
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Supabase upload error:', error);
            throw error;
        }

        const { data: publicUrlData } = supabase.storage
            .from('apple')
            .getPublicUrl(fileName);

        return NextResponse.json({ url: publicUrlData.publicUrl });
    } catch (error: any) {
        console.error('Upload route error:', error);
        return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
    }
}
