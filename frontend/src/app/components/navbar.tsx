"use client"
import Link from "next/link"
import { FiSearch } from "react-icons/fi"

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between py-4 px-8 shadow-md bg-white">
      <Link href="/" className="text-2xl font-bold text-green-600" aria-label="ReStyle Home">
        ReStyle
      </Link>

      <div className="flex justify-center flex-1  ">
        <label htmlFor="search" className="sr-only">Search items</label>
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-black text-xl" />
        <input 
          type="text" 
          id="search"
          placeholder="Search for items..."
          className="w-[60%]  border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="flex items-center gap-8">
        <Link 
          href="/login" 
          className="font-medium text-gray-800 hover:text-green-600 transition"
        >
          Login
        </Link>
        <Link 
          href="/signup" 
          className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-green-700 transition"
        >
          Sell now
        </Link>
      </div>
    </nav>
  )
}