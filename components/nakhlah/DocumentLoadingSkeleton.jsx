export default function DocumentLoadingSkeleton() {
  return (
    <div className="space-y-3" aria-label="Loading content">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="h-4 rounded bg-muted/40 animate-pulse"
          style={{ width: `${90 - (index % 5) * 8}%` }}
        />
      ))}
    </div>
  );
}
