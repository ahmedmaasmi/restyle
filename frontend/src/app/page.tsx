"use client"
import Navbar from "./components/navbar"
import HeroSlider from "./components/heroSlider";


export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="p-6">
    <HeroSlider />
      </main>
    </div>
  )
}
