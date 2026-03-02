import ReviewCard from "@/app/[lang]/(welcome)/detail/components/reviewContent/ReviewCard";

export type ReviewType = {
  userImage: string;
  userName: string;
  reviewDate: string;
  expression: string;
  review: string;
  reviewImage1: string;
  reviewImage2: string;
  helpful: number;
  id:number;
};

export default function Reviews() {
  const reviews: ReviewType[] = [
    {
      id:1,
      userImage: "https://example.com/images/user1.jpg",
      userName: "Alice Johnson",
      reviewDate: "08/20/2024",
      expression: "😍",
      review: "Amazing product quality and fast delivery. Highly recommended! Amazing product quality and fast delivery. Highly recommended! Amazing product quality and fast delivery. Highly recommended!",
      reviewImage1: "https://i.ibb.co.com/6RZpqXPz/2-1.png",
      reviewImage2: "https://i.ibb.co.com/tT8pN22X/banner-Image.png",
      helpful: 23,
    },
    {
      id:2,
      userImage: "https://example.com/images/user2.jpg",
      userName: "Mark Lee",
      reviewDate: "08/20/2024",
      expression: "😐",
      review: "It was okay. The packaging could be better. It was okay. The packaging could be better. It was okay. The packaging could be better. It was okay. The packaging could be better.",
      reviewImage1: "",
      reviewImage2: "https://i.ibb.co.com/tT8pN22X/banner-Image.png",
      helpful: 12,
    },
    {
      id:3,
      userImage: "https://example.com/images/user3.jpg",
      userName: "Sara Kim",
      reviewDate: "08/20/2024",
      expression: "😄",
      review: "Loved it! Will definitely come back for more. It was okay. The packaging could be better.",
      reviewImage1: "https://i.ibb.co.com/6RZpqXPz/2-1.png",
      reviewImage2: "https://i.ibb.co.com/tT8pN22X/banner-Image.png",
      helpful: 35,
    },
    {
      id:4,
      userImage: "https://example.com/images/user1.jpg",
      userName: "Alice Johnson",
      reviewDate: "08/20/2024",
      expression: "😍",
      review: "Amazing product quality and fast delivery. Highly recommended! Amazing product quality and fast delivery. Highly recommended! Amazing product quality and fast delivery. Highly recommended!",
      reviewImage1: "https://i.ibb.co.com/6RZpqXPz/2-1.png",
      reviewImage2: "https://i.ibb.co.com/tT8pN22X/banner-Image.png",
      helpful: 23,
    },
    {
      id:5,
      userImage: "https://example.com/images/user1.jpg",
      userName: "Alice Johnson",
      reviewDate: "08/20/2024",
      expression: "😍",
      review: "Amazing product quality and fast delivery. Highly recommended! Amazing product quality and fast delivery. Highly recommended! Amazing product quality and fast delivery. Highly recommended!",
      reviewImage1: "https://i.ibb.co.com/6RZpqXPz/2-1.png",
      reviewImage2: "https://i.ibb.co.com/tT8pN22X/banner-Image.png",
      helpful: 23,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:gap-10 lg:grid-cols-3">
      {reviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </div>
  );
}
