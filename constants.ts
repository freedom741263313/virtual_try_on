import { StyleOption } from './types';

export const STYLES: StyleOption[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    prompt: 'Change the clothing to a futuristic cyberpunk street style with neon accents, leather jacket, and tech-wear aesthetics. Keep the face and pose exactly the same.',
    icon: '⚡',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'business',
    name: 'Business Pro',
    prompt: 'Change the clothing to a high-end, tailored professional navy blue business suit with a crisp white shirt. Keep the face and pose exactly the same.',
    icon: '💼',
    color: 'from-blue-600 to-slate-800',
  },
  {
    id: 'casual',
    name: 'Street Casual',
    prompt: 'Change the clothing to a relaxed, trendy streetwear outfit with a graphic oversized hoodie and denim. Keep the face and pose exactly the same.',
    icon: '🧢',
    color: 'from-orange-400 to-red-500',
  },
  {
    id: 'fantasy',
    name: 'RPG Fantasy',
    prompt: 'Change the clothing to medieval fantasy rogue armor with leather straps, a cloak, and intricate details. Keep the face and pose exactly the same.',
    icon: '⚔️',
    color: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'gala',
    name: 'Red Carpet',
    prompt: 'Change the clothing to an elegant, glamorous red carpet evening gown or tuxedo with luxurious fabric textures. Keep the face and pose exactly the same.',
    icon: '✨',
    color: 'from-yellow-400 to-amber-600',
  },
  {
    id: 'summer',
    name: 'Beach Vibes',
    prompt: 'Change the clothing to a light, airy floral summer outfit suitable for a beach resort. Keep the face and pose exactly the same.',
    icon: '🏖️',
    color: 'from-cyan-400 to-blue-400',
  },
  {
    id: 'winter',
    name: 'Winter Coat',
    prompt: 'Change the clothing to a thick, cozy wool trench coat with a scarf, suitable for snowy weather. Keep the face and pose exactly the same.',
    icon: '❄️',
    color: 'from-slate-200 to-slate-400',
  }
];

export const MAX_FILE_SIZE_MB = 4;
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];