"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import BookCard from "@/components/BookCard";
import { BookCardSkeleton } from "@/components/BookCard";
import { useRouter } from "next/navigation";

export default function LibraryPage() {
  const { uid, isLoading } = useSelector((state: RootState) => state.user);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !uid) {
      router.push("/");
    }
  }, [uid, isLoading, router]);

  useEffect(() => {
    if (!uid) return;
    async function fetchLibrary() {
      try {
        const ref = collection(db, "users", uid!, "library");
        const snap = await getDocs(ref);
        const data = snap.docs.map((doc) => doc.data());
        setBooks(data);
      } catch (err) {
        console.error("Failed to fetch library", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLibrary();
  }, [uid]);

  if (isLoading) return null;
  if (!uid) return null;

  return (
    <div className="library__page">
      <h1 className="for-you__title">My Library</h1>
      {loading ? (
        <div className="for-you__books--wrapper">
          {[...Array(3)].map((_, i) => <BookCardSkeleton key={i} />)}
        </div>
      ) : books.length === 0 ? (
        <p className="library__empty">You haven't saved any books yet.</p>
      ) : (
        <div className="for-you__books--wrapper">
          {books.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              subTitle={book.subTitle}
              imageLink={book.imageLink}
              audioLink={book.audioLink}
              averageRating={book.averageRating}
              subscriptionRequired={book.subscriptionRequired}
            />
          ))}
        </div>
      )}
    </div>
  );
}