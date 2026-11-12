/**
 * Utilities for formatting and translating audit log and system activity actions
 * into consistent, user-friendly Bahasa Indonesia for frontend interfaces.
 */

export type AuditActionFormatMode = 'feed' | 'label';

export interface FormatAuditActionOptions {
  mode?: AuditActionFormatMode;
}

const AUDIT_ACTION_MAP: Record<string, { feed: string; label: string }> = {
  // Toko / Store
  'create store': { feed: 'membuat toko baru', label: 'Membuat Toko' },
  'suspend store': { feed: 'menangguhkan toko', label: 'Tangguhkan Toko' },
  'unsuspend store': { feed: 'memulihkan toko', label: 'Pulihkan Toko' },
  'store suspended': { feed: 'menangguhkan toko', label: 'Tangguhkan Toko' },
  'store unsuspended': { feed: 'memulihkan toko', label: 'Pulihkan Toko' },
  'update store settings': { feed: 'memperbarui pengaturan toko', label: 'Perbarui Pengaturan Toko' },

  // AI & Kredit
  'purchase ai credit': { feed: 'membeli kredit AI', label: 'Beli Kredit AI' },
  'attach ai image to product': { feed: 'menyematkan gambar AI ke produk', label: 'Sematkan Gambar AI' },

  // Template
  'purchase template': { feed: 'membeli template', label: 'Beli Template' },
  'download free template': { feed: 'mengunduh template gratis', label: 'Unduh Template Gratis' },
  'apply template': { feed: 'menerapkan template', label: 'Terapkan Template' },
  'approve template': { feed: 'menyetujui template', label: 'Setujui Template' },
  'reject template': { feed: 'menolak template', label: 'Tolak Template' },
  'submit template review': { feed: 'mengajukan kurasi template', label: 'Ajukan Kurasi Template' },
  'save template builder': { feed: 'menyimpan desain template', label: 'Simpan Desain Template' },

  // Rekening Bank & Keuangan
  'add bank account': { feed: 'menambahkan rekening bank', label: 'Tambah Rekening Bank' },
  'delete bank account': { feed: 'menghapus rekening bank', label: 'Hapus Rekening Bank' },
  'set primary bank account': { feed: 'mengatur rekening bank utama', label: 'Atur Rekening Utama' },
  'request payout': { feed: 'mengajukan penarikan dana', label: 'Tarik Dana' },

  // Pengguna & Otentikasi
  'register admin': { feed: 'mendaftarkan admin baru', label: 'Daftar Admin' },
  'register merchant': { feed: 'mendaftarkan merchant baru', label: 'Daftar Merchant' },
  'register subdomain': { feed: 'mendaftarkan subdomain', label: 'Daftar Subdomain' },
  'reset password': { feed: 'mereset kata sandi', label: 'Reset Kata Sandi' },
  'suspend user': { feed: 'menonaktifkan pengguna', label: 'Nonaktifkan Pengguna' },
  'unsuspend user': { feed: 'mengaktifkan kembali pengguna', label: 'Aktifkan Pengguna' },
  'user suspended': { feed: 'menonaktifkan akun pengguna', label: 'Nonaktifkan Pengguna' },
  'user activated': { feed: 'mengaktifkan akun pengguna', label: 'Aktifkan Pengguna' },
  'delete user': { feed: 'menghapus pengguna', label: 'Hapus Pengguna' },
  'update user quota': { feed: 'memperbarui kuota pengguna', label: 'Perbarui Kuota Pengguna' },

  // Whitelist Admin
  'add admin whitelist': { feed: 'menambahkan whitelist admin', label: 'Tambah Whitelist Admin' },
  'delete admin whitelist': { feed: 'menghapus whitelist admin', label: 'Hapus Whitelist Admin' },
  'update admin status': { feed: 'memperbarui status admin', label: 'Perbarui Status Admin' },

  // Produk & Stok
  'create product': { feed: 'menambahkan produk baru', label: 'Tambah Produk' },
  'update product': { feed: 'memperbarui informasi produk', label: 'Perbarui Produk' },
  'delete product': { feed: 'menghapus produk', label: 'Hapus Produk' },
  'update product stock': { feed: 'memperbarui stok produk', label: 'Perbarui Stok Produk' },

  // Kategori Bisnis & Template
  'create business category': { feed: 'membuat kategori bisnis', label: 'Tambah Kategori Bisnis' },
  'update business category': { feed: 'memperbarui kategori bisnis', label: 'Perbarui Kategori Bisnis' },
  'delete business category': { feed: 'menghapus kategori bisnis', label: 'Hapus Kategori Bisnis' },
  'create template category': { feed: 'membuat kategori template', label: 'Tambah Kategori Template' },
  'update template category': { feed: 'memperbarui kategori template', label: 'Perbarui Kategori Template' },
  'delete template category': { feed: 'menghapus kategori template', label: 'Hapus Kategori Template' },

  // Pengaturan Platform
  'update platform settings': { feed: 'memperbarui pengaturan platform', label: 'Perbarui Pengaturan Platform' },
  'update whatsapp template': { feed: 'memperbarui template WhatsApp', label: 'Perbarui Template WhatsApp' },
};

const WORD_DICTIONARY: Record<string, string> = {
  create: 'membuat',
  add: 'menambahkan',
  update: 'memperbarui',
  edit: 'mengubah',
  delete: 'menghapus',
  remove: 'menghapus',
  suspend: 'menangguhkan',
  unsuspend: 'memulihkan',
  purchase: 'membeli',
  buy: 'membeli',
  download: 'mengunduh',
  apply: 'menerapkan',
  approve: 'menyetujui',
  reject: 'menolak',
  register: 'mendaftarkan',
  submit: 'mengajukan',
  reset: 'mereset',
  set: 'mengatur',
  store: 'toko',
  user: 'pengguna',
  users: 'pengguna',
  admin: 'admin',
  merchant: 'merchant',
  designer: 'desainer',
  product: 'produk',
  products: 'produk',
  category: 'kategori',
  categories: 'kategori',
  business: 'bisnis',
  template: 'template',
  templates: 'template',
  account: 'rekening',
  bank: 'bank',
  payout: 'penarikan dana',
  quota: 'kuota',
  settings: 'pengaturan',
  platform: 'platform',
  password: 'kata sandi',
  stock: 'stok',
  whitelist: 'whitelist',
  subdomain: 'subdomain',
  whatsapp: 'WhatsApp',
  ai: 'AI',
  credit: 'kredit',
  credits: 'kredit',
  image: 'gambar',
  free: 'gratis',
  activated: 'diaktifkan',
  suspended: 'dinonaktifkan',
};

function normalizeActionKey(action: string): string {
  return action
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
}

function fallbackTranslate(normalized: string, mode: AuditActionFormatMode): string {
  const words = normalized.split(' ');
  const translatedWords = words.map((w) => WORD_DICTIONARY[w] || w);
  const sentence = translatedWords.join(' ');

  if (mode === 'feed') {
    return sentence;
  }

  // mode === 'label': Capitalize each word for badges/dropdowns
  return sentence
    .split(' ')
    .map((word) => (word === 'ai' ? 'AI' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}

/**
 * Format audit action string into user-friendly Bahasa Indonesia.
 *
 * @param action - Action identifier (e.g. 'Create Store', 'PURCHASE_AI_CREDIT', 'store_suspended')
 * @param options - Display mode ('feed' for activity feeds like "membuat toko baru", 'label' for badges/options like "Membuat Toko")
 * @returns Translated Indonesian string
 */
export function formatAuditAction(
  action: string | null | undefined,
  options: FormatAuditActionOptions = {}
): string {
  if (!action) return '-';

  const mode = options.mode || 'feed';
  const normalized = normalizeActionKey(action);

  const matched = AUDIT_ACTION_MAP[normalized];
  if (matched) {
    return matched[mode];
  }

  return fallbackTranslate(normalized, mode);
}

