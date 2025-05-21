import Image from "next/image";
import Objectdetection from "./components/Objectdetection"
export default function Home() {
  return (
      <main className="flex flex-col items-center bg-black min-h-screen  p-[32px]">
          <h1 className="gradient text-white text-3xl font-extrabold md:text-6xl lg:text-8xl md:px-6 tracking-tighter text-center">Object Detection Alarm</h1>
          <Objectdetection/>
      </main>
  );
}
