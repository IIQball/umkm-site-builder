export const iconOptions = [
  { value: 'restaurant', label: 'Kuliner (restaurant)' },
  { value: 'checkroom', label: 'Fashion (checkroom)' },
  { value: 'work', label: 'Jasa/Bisnis (work)' },
  { value: 'grid_view', label: 'Retail/Katalog (grid_view)' },
  { value: 'devices', label: 'Digital/Teknologi (devices)' },
  { value: 'local_cafe', label: 'Kafe (local_cafe)' },
  { value: 'spa', label: 'Kecantikan/Spa (spa)' },
  { value: 'fitness_center', label: 'Olahraga/Fitnes (fitness_center)' },
  { value: 'folder', label: 'Folder Umum (folder)' },
];

export const generateSlug = (val: string): string => {
  return val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};
