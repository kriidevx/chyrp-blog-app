export default function getFeatherIcon(type: string) {
  switch (type) {
    case 'photo': return '📸';
    case 'quote': return '💭';
    case 'link': return '🔗';
    case 'video': return '🎥';
    case 'audio': return '🎵';
    default: return '📝';
  }
}
