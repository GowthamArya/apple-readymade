import Header from "./components/Header";
import bgImage from "./Images/dark-bg.jpg";

export default function Home() {
  return (
    <div className="font-sans min-h-screen">
      <main
        className="min-h-screen w-full bg-cover bg-center"
        //style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <p className="text-sm text-gray-500 py-2">
          © {new Date().getFullYear()} Apple. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

