# Aturan Standar Bahasa Sistem (Backend vs Frontend)

## 1. Backend (Strict English)
- **Database & Schema**: Nama tabel, kolom, enum (`status: 'draft' | 'pending' | 'approved' | 'rejected'`, `type: 'CREDIT' | 'DEBIT'`), dan relasi wajib menggunakan bahasa Inggris.
- **API Spec & Routes**: Endpoint URL (`/api/designer/payout`), request/response payload key (`amount`, `balanceAfter`, `rejectionReason`), dan error codes (`UNAUTHORIZED_EMAIL`, `INSUFFICIENT_BALANCE`, `FORBIDDEN`).
- **Code & Architecture**: Penamaan variabel, method/fungsi, types/interfaces, server logs, dan komentar kode server wajib menggunakan bahasa Inggris.

## 2. Frontend Antarmuka (Strict Bahasa Indonesia)
- **Semua Label & Teks UI**: Wajib 100% menggunakan Bahasa Indonesia (contoh: `Katalog Desain Saya`, `Riwayat Penarikan Dana`, `Pengaturan Komisi Platform`, `Masa Berlaku`, `Pemilik Rekening`, `Nominal Penarikan`).
- **Status Badges & Chips**:
  - `pending` -> `Menunggu Review` / `Perlu Ditinjau` / `Diproses`
  - `approved` -> `Disetujui` / `Siap Pakai` / `Selesai`
  - `rejected` -> `Ditolak` / `Perlu Revisi`
  - `draft` -> `Draft` / `Dalam Proses`
  - `credit` -> `Masuk` / `Kredit (Komisi Penjualan)`
  - `debit` -> `Keluar` / `Debit (Penarikan Dana)`
- **Tooltips, Modals & Alerts**: Semua judul modal, konfirmasi form, pesan toast alert, tooltip tombol, deskripsi input, dan pesan error validasi antarmuka wajib dalam Bahasa Indonesia yang baku dan ramah pengguna.
