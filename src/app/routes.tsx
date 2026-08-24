export type SceneType = 'katon' | 'nature' | 'music' | 'architecture';

export const routes = [
  { id: 'katon', label: 'Катонқарағай' },
  { id: 'nature', label: 'Природа' },
  { id: 'music', label: 'Музыка' },
  { id: 'architecture', label: 'Архитектура' }
] as const;
