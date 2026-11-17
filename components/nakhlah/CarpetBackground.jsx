export default function CarpetBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 store-accent-background"
    >
      {/* The tile repeats vertically at its designed aspect ratio; taller sections get more repeats. */}
      <div
        className="absolute inset-y-0 left-0 w-10 bg-repeat-y"
        style={{
          backgroundImage: "url('/bg-home/purple_carpet_border_tile.svg')",
          backgroundSize: "40px 56px",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-10 scale-x-[-1] bg-repeat-y"
        style={{
          backgroundImage: "url('/bg-home/purple_carpet_border_tile.svg')",
          backgroundSize: "40px 56px",
        }}
      />
    </div>
  );
}
