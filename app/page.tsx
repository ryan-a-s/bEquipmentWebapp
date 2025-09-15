
import Image from "next/image";
import Link from 'next/link'; //Link needed for links to work github pages



const BASE_PATH = '/bEquipmentWebapp'; // Only used for images

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          Log in authentication goes here.
        </ol>

        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="/main"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src={`${BASE_PATH}/vercel.svg`} // only prepend basePath for static assets
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Start App
          </Link>

        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
