"use client";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ProductCarousel({ product }: { product: any }) {
    return <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={3000}
            showArrows={false}
            className="rounded-md"
        >
            {product.image_urls.map((url: string, idx: number) => (
            <div key={url}>
                <img
                src={url}
                alt={`${product.product.name} image ${idx + 1}`}
                className="w-full h-48 md:h-64 object-cover rounded-md"
                />
            </div>
            ))}
        </Carousel>
}