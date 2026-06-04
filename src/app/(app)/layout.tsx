import Sidebar from "@/components/Sidebar";

export default function ForYouLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="with__sidebar">
      <Sidebar />
      <div className="with__sidebar--content">
        {children}
      </div>
    </div>
  );
}