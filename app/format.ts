export const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const percentage = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compactNumber = new Intl.NumberFormat("id-ID", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function compactRupiah(value: number) {
  const absolute = Math.abs(value);

  if (absolute >= 1_000_000_000_000) {
    return `Rp ${compactNumber.format(value / 1_000_000_000_000)} Triliun`;
  }

  if (absolute >= 1_000_000_000) {
    return `Rp ${compactNumber.format(value / 1_000_000_000)} Milyar`;
  }

  if (absolute >= 1_000_000) {
    return `Rp ${compactNumber.format(value / 1_000_000)} Juta`;
  }

  return rupiah.format(value).replace("Rp", "Rp ");
}
