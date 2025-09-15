import Image from "next/image";
import Link from 'next/link';

const BASE_PATH = '/bEquipmentWebapp'; // Only used for images

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center p-8 gap-8 sm:p-4 bg-gray-50">
      <main className="flex flex-col items-center gap-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Equipment Tool</h1>
        <p className="text-center text-gray-600">
          Log in authentication goes here. (later)
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 px-4 sm:px-5 w-full justify-center"
            href="/main"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src={`${BASE_PATH}/vercel.svg`}
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Start App
          </Link>

          <Link
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 px-4 sm:px-5 w-full justify-center"
            href="/debug"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src={`${BASE_PATH}/vercel.svg`}
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Equipment List Checker
          </Link>
        </div>
      </main>

      <footer className="flex gap-6 flex-wrap items-center justify-center text-gray-400 text-sm">
      </footer>
    </div>
  );
}
