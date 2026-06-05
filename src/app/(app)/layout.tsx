import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";

export default function ForYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
  <div className="with__sidebar">
    <Sidebar />
    <div className="with__sidebar--content">
      <div className="search__bar--wrapper">
        <SearchBar />
      </div>
      <div className="page__content">
        {children}
      </div>
    </div>
  </div>
);
}