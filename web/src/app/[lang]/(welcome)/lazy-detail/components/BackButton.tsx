"use client"
import { useRouter } from "next/navigation"

export default function BackButton() {
    const router = useRouter()
  return (
    <button className="absolute top-7 left-3 z-10" onClick={() => router.push('/')}>
        <img src="/images/lazy-detail/backImage.png" alt="back button" />
    </button>
  )
}
