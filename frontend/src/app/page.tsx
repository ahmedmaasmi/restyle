import Navbar from "@/app/components/navbar"

export default function Home() {
  return (
    <div>
      <Navbar />
      <main className="p-6">
        <h1 className="text-3xl font-bold text-center mt-10 text-green-600">
          Welcome to Vinted Clone 🛍️
        </h1>
      </main>
    </div>
  )
}
