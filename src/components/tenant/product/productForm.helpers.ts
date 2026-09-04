import type { VariantGroup, VariantOption } from "../../../schemas/product-variant.schema";

export function deserializeVariants(raw: unknown): VariantGroup[] {
  if (!Array.isArray(raw) || raw.length === 0) return [];

  // Handle new structured format
  if (raw[0] && typeof raw[0] === "object" && "groupName" in raw[0]) {
    return raw as VariantGroup[];
  }

  // Migrate legacy flat format: [{ name: "S" }, { name: "L" }]
  if (raw[0] && typeof raw[0] === "object" && "name" in raw[0]) {
    const legacyOptions: VariantOption[] = raw.map((v: unknown) => ({
      name: typeof v === "object" && v !== null && "name" in v
        ? String((v as { name: string }).name)
        : String(v),
      priceAdjustment: 0,
      isAvailable: true,
    }));
    return [{ groupName: "Varian", options: legacyOptions }];
  }

  return [];
}

export function formatPriceAdjustment(value: number): string {
  if (value === 0) return "";
  const prefix = value > 0 ? "+" : "";
  return prefix + value.toLocaleString("id-ID");
}

export function parsePriceAdjustment(raw: string): number {
  const cleaned = raw.replace(/[^0-9-]/g, "");
  return cleaned ? parseInt(cleaned, 10) : 0;
}

export function validateVariantGroups(
  groups: VariantGroup[],
  setFieldError: (key: string, msg: string) => void
): boolean {
  for (let gi = 0; gi < groups.length; gi++) {
    const group = groups[gi];
    if (!group.groupName.trim()) {
      setFieldError(`variantGroup_${gi}`, "Nama grup varian wajib diisi");
      return false;
    }
    for (let oi = 0; oi < group.options.length; oi++) {
      if (!group.options[oi].name.trim()) {
        setFieldError(`variantOption_${gi}_${oi}`, "Nama opsi wajib diisi");
        return false;
      }
    }
  }
  return true;
}
