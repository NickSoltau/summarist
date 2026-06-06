"use client";

import { useRouter } from "next/navigation";
import { AiOutlineClockCircle, AiOutlinePlayCircle } from "react-icons/ai";

interface SelectedBookProps {
  id: string;
  title: string;
  author: string;
  subTitle: string;
  imageLink: string;
  subscriptionRequired: boolean;
}

export default function SelectedBook({
  id,
  title,
  author,
  subTitle,
  imageLink,
  subscriptionRequired,
}: SelectedBookProps) {
  const router = useRouter();

  return (
    <div className="selected__book" onClick={() => router.push(`/book/${id}`)}>
      {subscriptionRequired && (
        <div className="book__card--pill">Premium</div>
      )}
      <p className="selected__book--subtitle">{subTitle}</p>
      <div className="selected__book--content">
        <div className="selected__book--divider" />
        <img src={imageLink} alt={title} className="selected__book--img" />
        <div className="selected__book--divider" />
        <div className="selected__book--info">
          <p className="selected__book--title">{title}</p>
          <p className="selected__book--author">{author}</p>
          <div className="selected__book--duration">
            <AiOutlinePlayCircle />
            <AiOutlineClockCircle />
            <span>3 mins 23 secs</span>
          </div>
        </div>
      </div>
    </div>
  );
}