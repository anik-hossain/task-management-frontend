export default function getBadgeColor(value: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-300 text-yellow-800',
    'in-progress': 'bg-blue-300 text-blue-800',
    completed: 'bg-green-300 text-green-800',
  };

  return map[value] || 'bg-gray-200 text-gray-700';
}
