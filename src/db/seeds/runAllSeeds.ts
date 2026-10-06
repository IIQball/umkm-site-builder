/* eslint-disable no-console */
import { seedCategories } from "./seedCategories";
import { seedTemplates } from "./seedTemplates";
import { seedMerchants } from "./seedMerchants";
import { seedTransactions } from "./seedTransactions";
import { seedWallets } from "./seedWallets";

async function run() {
  try {
    // 1. Kategori Template & Bisnis (20 items)
    await seedCategories();

    // 2. Template Desain (20 items)
    await seedTemplates();

    // 3. Pedagang UMKM Binaan & Toko (20 items)
    await seedMerchants();

    // 4. Transaksi Pembelian Template & Komisi (20 items)
    await seedTransactions();

    // 5. Payout Requests & Mutasi Wallet (Admin & Desainer, 20 items masing-masing)
    await seedWallets();
    process.exit(0);
  } catch (error) {
    console.error("[ERROR] Gagal menyemai data:", error);
    process.exit(1);
  }
}

run();
