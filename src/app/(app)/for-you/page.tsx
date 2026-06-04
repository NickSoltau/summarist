"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import BookCard from "@/components/BookCard";



export default function ForYouPage() {
  const router = useRouter();
  const { uid, isLoading } = useSelector((state: RootState) => state.user);
  const [selectedBook, setSelectedBook] = useState<any>(null);
const [recommendedBooks, setRecommendedBooks] = useState<any[]>([]);
const [suggestedBooks, setSuggestedBooks] = useState<any[]>([]);
const [booksLoading, setBooksLoading] = useState(true);

useEffect(() => {
  if (!isLoading && !uid) {
    router.push("/");
  }
}, [uid, isLoading, router]);

useEffect(() => {
  if (!uid) return;
  
  async function fetchBooks() {
    try {
      const [selected, recommended, suggested] = await Promise.all([
        fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected").then(r => r.json()),
        fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended").then(r => r.json()),
        fetch("https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested").then(r => r.json()),
      ]);
      setSelectedBook(selected[0]);
      setRecommendedBooks(recommended);
      setSuggestedBooks(suggested);
    } catch (err) {
      console.error("Failed to fetch books", err);
    } finally {
      setBooksLoading(false);
    }
  }

  fetchBooks();
}, [uid]);

if (isLoading) return null;
if (!uid) return null;

 return (
  <div className="for-you">
    <h2 className="for-you__title">Selected just for you</h2>
    {booksLoading ? (
      <p>Loading...</p>
    ) : (
      <>
        {/* Selected Book */}
        {selectedBook && (
          <BookCard
            id={selectedBook.id}
            title={selectedBook.title}
            author={selectedBook.author}
            subTitle={selectedBook.subTitle}
            imageLink={selectedBook.imageLink}
            averageRating={selectedBook.averageRating}
            subscriptionRequired={selectedBook.subscriptionRequired}
          />
        )}

        {/* Recommended Books */}
        <h2 className="for-you__title">Recommended for you</h2>
        <div className="for-you__books--wrapper">
          {recommendedBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              subTitle={book.subTitle}
              imageLink={book.imageLink}
              averageRating={book.averageRating}
              subscriptionRequired={book.subscriptionRequired}
            />
          ))}
        </div>

        {/* Suggested Books */}
        <h2 className="for-you__title">Suggested books</h2>
        <div className="for-you__books--wrapper">
          {suggestedBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              subTitle={book.subTitle}
              imageLink={book.imageLink}
              averageRating={book.averageRating}
              subscriptionRequired={book.subscriptionRequired}
            />
          ))}
        </div>
      </>
    )}
  </div>
);
}