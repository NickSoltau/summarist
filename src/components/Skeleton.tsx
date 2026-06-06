export default function Skeleton({ width, height, borderRadius = "4px" }: {
  width: string;
  height: string;
  borderRadius?: string;
}) {
  return (
    <div
      className="skeleton"
      style={{ width, height, borderRadius }}
    />
  );
}