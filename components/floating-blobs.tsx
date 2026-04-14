export function FloatingBlobs() {
  return (
    <>
      <div className="absolute left-8 top-20 h-72 w-72 animate-blob rounded-full bg-blue-300/60 blur-3xl" />
      <div className="absolute right-12 top-12 h-72 w-72 animate-blob rounded-full bg-cyan-300/50 blur-3xl [animation-delay:2s]" />
      <div className="absolute bottom-8 left-1/3 h-72 w-72 animate-blob rounded-full bg-indigo-300/50 blur-3xl [animation-delay:4s]" />
      <div className="absolute bottom-24 right-1/4 h-60 w-60 animate-blob rounded-full bg-pink-300/40 blur-3xl [animation-delay:6s]" />
    </>
  );
}
