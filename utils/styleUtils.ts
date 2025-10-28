export const getBadgeStyle = (type: string): string => {
  switch(type) {
    case 'pdf': return 'bg-blue-900 text-blue-300';
    case 'file': return 'bg-indigo-900 text-indigo-300';
    case 'url': return 'bg-yellow-900 text-yellow-300';
    case 'text':
    default:
      return 'bg-green-900 text-green-300';
  }
};
