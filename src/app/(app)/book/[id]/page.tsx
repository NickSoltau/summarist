"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { openModal } from "@/store/modalSlice";
import { useRouter } from "next/navigation";

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter()
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
const { uid } = useSelector((state: RootState) => state.user);

const handleReadListen = () => {
  if (!uid) {
    dispatch(openModal());
    return;
  }
  if (book.subscriptionRequired) {
    router.push("/choose-plan");
    return;
  }
  router.push(`/player/${id}`);
};

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
        );
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Failed to fetch book", err);
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!book) return <p>Book not found</p>;

return (
  <div className="book__page">
    <div className="book__page--content">
      <div className="book__page--left">
        <h1 className="book__page--title">{book.title}</h1>
        <h2 className="book__page--author">{book.author}</h2>
        <p className="book__page--subtitle">{book.subTitle}</p>
        <div className="book__page--details">
          <div className="book__page--detail">
            <span>⭐ {book.averageRating} ({book.totalRating} ratings)</span>
          </div>
          <div className="book__page--detail">
            <span>🎧 {book.type}</span>
          </div>
          <div className="book__page--detail">
            <span>💡 {book.keyIdeas} key ideas</span>
          </div>
        </div>
        <div className="book__page--buttons">
          <button className="btn book__page--btn" onClick={handleReadListen}>Read</button>
          <button className="btn book__page--btn" onClick={handleReadListen}>Listen</button>
        </div>
        <div className="book__page--library">
          <button className="book__page--library-btn">+ Add title to My Library</button>
        </div>
        <div className="book__page--tags--wrapper">
          <h3>What's it about?</h3>
          <div className="book__page--tags">
            {book.tags?.map((tag: string) => (
              <span key={tag} className="book__page--tag">{tag}</span>
            ))}
          </div>
        </div>
        <div className="book__page--description">
          <p>{book.bookDescription}</p>
        </div>
        <div className="book__page--author-description">
          <h3>About the author</h3>
          <p>{book.authorDescription}</p>
        </div>
      </div>
      <div className="book__page--right">
        <img src={book.imageLink} alt={book.title} className="book__page--img" />
      </div>
    </div>
  </div>
);
}