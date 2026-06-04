"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/index";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";



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
  <div>
    <h1>For You Page</h1>
    {booksLoading ? (
      <p>Loading books...</p>
    ) : (
      <div>
        <h2>Selected: {selectedBook?.title}</h2>
        <h2>Recommended: {recommendedBooks.length} books</h2>
        <h2>Suggested: {suggestedBooks.length} books</h2>
      </div>
    )}
  </div>
);
}