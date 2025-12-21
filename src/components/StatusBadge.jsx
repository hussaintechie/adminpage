export default function StatusBadge({ status }) {
  const styles = {
    Pending: 'bg-amber-100 text-amber-700',
    Delivered: 'bg-emerald-100 text-emerald-700',
    Cancelled: 'bg-red-100 text-red-700',
    Dispatched: 'bg-blue-100 text-blue-700',
    Processing: 'bg-purple-100 text-purple-700',
    Active: 'bg-green-100 text-green-700',
    Blocked: 'bg-red-100 text-red-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || 'bg-gray-100'}`}>
      {status}
    </span>
  );
}
