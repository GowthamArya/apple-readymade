"use client";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function ProductCarousel({ product }: { product: any }) {
    if (!product || !product.image_urls || product.image_urls.length === 0) {
        return <div className="w-full h-36 md:h-56 bg-gray-200 flex items-center justify-center rounded-md">
            <span className="text-gray-500">No Image Available</span>
        </div>;
    }
    return <Carousel
            showThumbs={false}
            showStatus={false}
            infiniteLoop
            autoPlay
            interval={2500}
            showArrows={false}
            showIndicators={false}
            className="rounded-md"
            stopOnHover={true}
            emulateTouch
            dynamicHeight={false}
            centerMode={false}
            centerSlidePercentage={100}
            transitionTime={500}
        >
            {product.image_urls.map((url: string, idx: number) => (
            <div key={url}>
                <img
                src={url}
                alt={`${product.product.name} image ${idx + 1}`}
                className="w-full h-36 md:h-56 object-cover rounded-md select-none"
                />
            </div>
            ))}
        </Carousel>
}