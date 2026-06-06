"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { openModal } from "@/store/modalSlice";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/Skeleton";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";

export default function BookPage() {
  const { id } = useParams();
  const router = useRouter()
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const dispatch = useDispatch();
  const { uid } = useSelector((state: RootState) => state.user);
  const [subscription, setSubscription] = useState<string>("Basic");

const handleReadListen = () => {
  if (!uid) {
    dispatch(openModal());
    return;
  }
  if (book.subscriptionRequired && subscription === "Basic") {
    router.push("/choose-plan");
    return;
  }
  router.push(`/player/${id}`);
};

useEffect(() => {
  if (!uid || !id) return;
  async function checkLibrary() {
    const ref = doc(db, "users", uid!, "library", id as string);
    const snap = await getDoc(ref);
    setIsInLibrary(snap.exists());
  }
  checkLibrary();
}, [uid, id]);

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

  useEffect(() => {
  if (!uid) return;
  async function fetchSubscription() {
    try {
      const ref = doc(db, "users", uid!);
      const snap = await getDoc(ref);
      if (snap.exists() && snap.data().subscriptionStatus) {
        setSubscription(snap.data().subscriptionStatus);
      }
    } catch (err) {
      console.error("Failed to fetch subscription", err);
    }
  }
  fetchSubscription();
}, [uid]);

  const handleLibrary = async () => {
  if (!uid) {
    dispatch(openModal());
    return;
  }
  const ref = doc(db, "users", uid, "library", id as string);
  if (isInLibrary) {
    await deleteDoc(ref);
    setIsInLibrary(false);
  } else {
    await setDoc(ref, {
      id,
      title: book.title,
      author: book.author,
      subTitle: book.subTitle,
      imageLink: book.imageLink,
      audioLink: book.audioLink,
      averageRating: book.averageRating,
      subscriptionRequired: book.subscriptionRequired,
    });
    setIsInLibrary(true);
  }
};

  if (loading) return (
  <div className="book__page">
    <div className="book__page--content">
      <div className="book__page--left">
        <Skeleton width="60%" height="32px" />
        <div style={{ marginTop: "8px" }}>
          <Skeleton width="40%" height="20px" />
        </div>
        <div style={{ marginTop: "8px" }}>
          <Skeleton width="80%" height="16px" />
        </div>
        <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <Skeleton width="50%" height="16px" />
          <Skeleton width="40%" height="16px" />
          <Skeleton width="45%" height="16px" />
        </div>
        <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
          <Skeleton width="140px" height="40px" />
          <Skeleton width="140px" height="40px" />
        </div>
        <div style={{ marginTop: "24px" }}>
          <Skeleton width="100%" height="16px" />
          <div style={{ marginTop: "4px" }}>
            <Skeleton width="100%" height="16px" />
          </div>
          <div style={{ marginTop: "4px" }}>
            <Skeleton width="70%" height="16px" />
          </div>
        </div>
      </div>
      <div className="book__page--right">
        <Skeleton width="180px" height="240px" />
      </div>
    </div>
  </div>
);
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
          <button className="book__page--library-btn" onClick={handleLibrary}>
            {isInLibrary ? "✓ Saved to My Library" : "+ Add title to My Library"}
          </button>
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