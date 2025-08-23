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
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 p-2">
            {collections.map((collection) => (
                <div key={collection.name} className="relative bg-white dark:bg-black p-5 rounded-lg shadow-sm flex h-96">
                    {collection.img && 
                        <img className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-70" src={collection.img} width="300" alt={collection.name} />
                    }
                    <p className="absolute left-2 bottom-2 bg-white p-2 text-lg font-semibold text-black dark:text-white">{collection.name}</p>
                </div>
            ))}
        </div>
    )
}