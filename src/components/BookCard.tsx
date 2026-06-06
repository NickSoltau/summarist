"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { BsStarFill } from "react-icons/bs";
import { AiOutlineClockCircle } from "react-icons/ai";
import Skeleton from "./Skeleton";

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

export function BookCardSkeleton() {
  return (
    <div className="book__card">
      <Skeleton width="100%" height="172px" />
      <div style={{ marginTop: "8px" }}>
        <Skeleton width="80%" height="16px" />
        <div style={{ marginTop: "4px" }}>
          <Skeleton width="60%" height="14px" />
        </div>
        <div style={{ marginTop: "4px" }}>
          <Skeleton width="90%" height="14px" />
        </div>
        <div style={{ marginTop: "8px", display: "flex", gap: "12px" }}>
          <Skeleton width="40%" height="13px" />
          <Skeleton width="30%" height="13px" />
        </div>
      </div>
    </div>
  );
}