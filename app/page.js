import Image from "next/image";

export default function Home() {
  return (
    <div >
     <button class="group relative h-12 overflow-hidden overflow-x-hidden rounded-md bg-neutral-50 hover:text-neutral-50 duration-300 px-8 py-2 "><span class="relative z-10">Hover Me</span><span class="absolute inset-0 overflow-hidden rounded-md"><span class="absolute left-0 aspect-square w-full origin-center -translate-x-full rounded-full bg-[#2a5a49]  transition-all duration-500 group-hover:-translate-x-0 group-hover:scale-150"></span></span></button>
    </div>
  );
}
