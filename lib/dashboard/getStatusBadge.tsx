export default function getStatusBadge(status: string) {
  if (status === 'published') {
    return (
      <span className="px-3 py-1 bg-green-500/20 text-green-600 rounded-full text-xs font-semibold">
        Published
      </span>
    );
  }
  return (
    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-600 rounded-full text-xs font-semibold">
      Draft
    </span>
  );
}
