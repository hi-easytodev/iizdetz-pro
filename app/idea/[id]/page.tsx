export default function IdeaDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center py-20">
        <h1 className="text-4xl font-bold text-white mb-4">
          Детальная страница идеи #{params.id}
        </h1>
        <p className="text-[var(--text-secondary)] text-lg">
          В разработке...
        </p>
      </div>
    </div>
  );
}
