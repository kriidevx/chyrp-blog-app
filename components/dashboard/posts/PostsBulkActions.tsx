type Props = {
  selectedCount: number;
  onCancel: () => void;
};

export default function PostsBulkActions({ selectedCount, onCancel }: Props) {
  return (
    <div className="bg-blue-600/20 backdrop-blur-xl border border-blue-600/30 rounded-2xl p-4 mb-6 animate-in slide-in-from-top-2">
      <div className="flex items-center justify-between">
        <span className="text-blue-600 font-semibold">
          {selectedCount} post{selectedCount > 1 ? 's' : ''} selected
        </span>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
            Publish Selected
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium">
            Delete Selected
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-white/20 backdrop-blur-xl text-slate-900 rounded-xl hover:bg-white/30 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
