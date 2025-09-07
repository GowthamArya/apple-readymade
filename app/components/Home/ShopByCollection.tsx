import Link from "next/link";

const collections = [
    { 
        name: "Formals", 
        img: "https://images.unsplash.com/photo-1599817620437-841f945171f7?q=80&w=733&auto=format&fit=crop&ixlib=rb-4.1.0"
    },
    { 
        name: "Casuals", 
        img: "https://i.pinimg.com/1200x/3a/04/37/3a0437e26af38e2d544734ad0778fd0b.jpg"
    },
    { name: "Bottom Wear", 
        img: "https://i.pinimg.com/736x/72/ad/07/72ad07e1c4c730f485bf83116c70718f.jpg"
    },
    { name: "Accessories", 
        img: "https://i.pinimg.com/736x/9a/f8/3e/9af83e3aeb36a4a2361811ec3453e65f.jpg"
    },
  ];

export default function ShopByCollection() {
    return (
        <div
            data-scroll
            className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 px-4 dark:bg-black bg-gray-50"
            >
            {collections.map((collection) => (
                <Link
                key={collection.name}
                href={`/Collections#${collection.name.toLowerCase()}`}
                className="group"
                >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white dark:bg-zinc-900 h-64 md:h-80">
                    {collection.img && (
                    <img
                        src={collection.img}
                        alt={collection.name}
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-900 ease-in-out"
                    />
                    )}
                    {/* Label */}
                    <p className="absolute bottom-4 left-4 text-white dark:text-white text-lg font-semibold bg-black/60 dark:bg-black/70 px-3 py-1 rounded-md shadow-sm">
                    {collection.name}
                    </p>
                </div>
                </Link>
                ))}
        </div>
    )
}