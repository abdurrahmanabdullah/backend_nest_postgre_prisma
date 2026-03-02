import Expression from "@/app/[lang]/(welcome)/detail/components/reviewContent/Expression";
import WriteReview from "@/app/[lang]/(welcome)/detail/components/reviewContent/WriteReview";
import Reviews from "@/app/[lang]/(welcome)/detail/components/reviewContent/Reviews";


export default function ReviewContent() {
  return (
    <div className="px-4">
      <Expression/>
      <WriteReview/>
      <Reviews/>
    </div>
  )
}

