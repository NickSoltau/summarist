"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  averageRating: number;
  subscriptionRequired: boolean;
}

export default function BookCard({
  id,
  title,
  author,
  subTitle,
  imageLink,
  averageRating,
  subscriptionRequired,
}: BookCardProps) {
  const router = useRouter();

  return (
    <div className="book__card" onClick={() => router.push(`/book/${id}`)}>
      {subscriptionRequired && (
        <div className="book__card--pill">Premium</div>
      )}
      <img src={imageLink} alt={title} className="book__card--img" />
      <div className="book__card--title">{title}</div>
      <div className="book__card--author">{author}</div>
      <div className="book__card--subtitle">{subTitle}</div>
      <div className="book__card--details">
        <div className="book__card--detail">
          <AiOutlineClockCircle />
          <span>04:00</span>
        </div>
        <div className="book__card--detail">
          <BsStarFill />
          <span>{averageRating}</span>
        </div>
      </div>
    </div>
  );
}