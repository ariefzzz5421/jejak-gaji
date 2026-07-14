export type ProfessionSlug = "guru" | "polisi" | "tni" | "upah-minimum" | "freelance";

export type Profession = {
  slug: ProfessionSlug;
  name: string;
  navName: string;
  eyebrow: string;
  tagline: string;
  description: string;
  icon: string;
  accent: string;
  softAccent: string;
  defaultSalary: number;
  startAge: number;
  retirementAge: number;
  annualPayments: number;
  salaryBasis: string;
  salaryNote: string;
  salarySource: string;
};

export const professions: Record<ProfessionSlug, Profession> = {
  guru: {
    slug: "guru",
    name: "Guru ASN",
    navName: "Guru",
    eyebrow: "Jalur pendidikan",
    tagline: "Berapa nilai satu masa bakti seorang guru?",
    description:
      "Simulasi Guru ASN dengan gaji pokok, tunjangan, THR, dan gaji ke-13 yang disederhanakan menjadi penghasilan bulanan.",
    icon: "✦",
    accent: "#9c451f",
    softAccent: "#f6dfcf",
    defaultSalary: 5_500_000,
    startAge: 23,
    retirementAge: 60,
    annualPayments: 14,
    salaryBasis: "Contoh total penghasilan Rp5,5 juta/bulan",
    salaryNote:
      "Gaji pokok PNS Golongan III/a resmi berada di Rp2,79–4,58 juta; total yang diterima berbeda menurut masa kerja, sertifikasi, dan tunjangan daerah.",
    salarySource: "https://peraturan.bpk.go.id/Details/276755/pp-no-5-tahun-2024",
  },
  polisi: {
    slug: "polisi",
    name: "Anggota Polri",
    navName: "Polisi",
    eyebrow: "Jalur kepolisian",
    tagline: "Lihat nilai ekonomi dari puluhan tahun dinas.",
    description:
      "Contoh anggota Polri dengan penghasilan Rp6 juta per bulan, sesuai contoh awal dan dapat disesuaikan dengan pangkat serta tunjangan.",
    icon: "⬡",
    accent: "#174b3d",
    softAccent: "#d7e9df",
    defaultSalary: 6_000_000,
    startAge: 19,
    retirementAge: 59,
    annualPayments: 14,
    salaryBasis: "Contoh total penghasilan Rp6 juta/bulan",
    salaryNote:
      "Gaji pokok Bripda resmi Rp2,27–3,73 juta. Simulasi memakai total penghasilan contoh karena tunjangan dan masa kerja sangat bervariasi.",
    salarySource: "https://peraturan.bpk.go.id/Details/276772/pp-no-7-tahun-2024",
  },
  tni: {
    slug: "tni",
    name: "Prajurit TNI",
    navName: "TNI",
    eyebrow: "Jalur pertahanan",
    tagline: "Hitung masa dinas, penghasilan, dan masa pensiun.",
    description:
      "Simulasi prajurit TNI jalur Bintara/Tamtama. Usia pensiun dapat diubah untuk menyesuaikan pangkat dan jalur karier.",
    icon: "★",
    accent: "#42512d",
    softAccent: "#e0e6d3",
    defaultSalary: 6_000_000,
    startAge: 19,
    retirementAge: 55,
    annualPayments: 14,
    salaryBasis: "Contoh total penghasilan Rp6 juta/bulan",
    salaryNote:
      "Gaji pokok mengikuti PP 6/2024. Batas pensiun dasar 55 tahun untuk Bintara/Tamtama dan 58 tahun untuk Perwira hingga Kolonel.",
    salarySource: "https://peraturan.bpk.go.id/Details/276758/pp-no-6-tahun-2024",
  },
  "upah-minimum": {
    slug: "upah-minimum",
    name: "Pekerja Upah Minimum",
    navName: "UMK / UMP",
    eyebrow: "Jalur pekerja daerah",
    tagline: "Mulai dari kota tempatmu bekerja.",
    description:
      "Pilih kota untuk mengisi UMK atau UMP 2026 secara otomatis. Nilai berlaku sebagai batas minimum bagi pekerja dengan masa kerja kurang dari satu tahun.",
    icon: "⌖",
    accent: "#29476d",
    softAccent: "#dce8f4",
    defaultSalary: 2_742_806,
    startAge: 20,
    retirementAge: 59,
    annualPayments: 13,
    salaryBasis: "Otomatis mengikuti UMK/UMP kota 2026",
    salaryNote:
      "UMK/UMP bukan rata-rata gaji dan terutama berlaku untuk pekerja dengan masa kerja kurang dari satu tahun. THR dihitung sebagai satu kali upah.",
    salarySource: "https://www.ptgasi.co.id/wp-content/uploads/2025/12/DAFTAR-UMK-TAHUN-2026.pdf",
  },
  freelance: {
    slug: "freelance",
    name: "Freelancer",
    navName: "Freelance",
    eyebrow: "Jalur kerja mandiri",
    tagline: "Pendapatan tidak tetap tetap bisa punya arah.",
    description:
      "Simulasi pekerja lepas dengan pendapatan bulanan yang bisa diubah. Tidak ada THR atau usia pensiun wajib, jadi target pensiun dan dana pengaman perlu ditentukan sendiri.",
    icon: "F",
    accent: "#6a3f72",
    softAccent: "#eaddef",
    defaultSalary: 6_000_000,
    startAge: 20,
    retirementAge: 60,
    annualPayments: 12,
    salaryBasis: "Isi rata-rata pendapatan bersih per bulan",
    salaryNote:
      "Pendapatan freelance dapat berubah tiap bulan dan biasanya tidak memiliki THR, gaji ke-13, atau pensiun dari pemberi kerja. Gunakan rata-rata 6-12 bulan agar hasil lebih masuk akal.",
    salarySource: "https://www.bps.go.id/id/statistics-table/2/MTk3NSMy/persentase-tenaga-kerja-formal-menurut-provinsi.html",
  },
};

export const professionList = Object.values(professions);

export type CityWage = {
  id: string;
  city: string;
  province: string;
  amount: number;
  type: "UMK" | "UMP";
  source: string;
};

const wageCompilation =
  "https://www.ptgasi.co.id/wp-content/uploads/2025/12/DAFTAR-UMK-TAHUN-2026.pdf";

export const cityWages: CityWage[] = [
  {
    id: "jakarta",
    city: "DKI Jakarta",
    province: "DKI Jakarta",
    amount: 5_729_876,
    type: "UMP",
    source: "https://jdih.jakarta.go.id/dokumen/detail/14763",
  },
  { id: "bekasi", city: "Kota Bekasi", province: "Jawa Barat", amount: 5_999_443, type: "UMK", source: wageCompilation },
  { id: "depok", city: "Kota Depok", province: "Jawa Barat", amount: 5_522_662, type: "UMK", source: wageCompilation },
  { id: "bogor", city: "Kota Bogor", province: "Jawa Barat", amount: 5_437_203, type: "UMK", source: wageCompilation },
  { id: "bandung", city: "Kota Bandung", province: "Jawa Barat", amount: 4_737_678, type: "UMK", source: wageCompilation },
  { id: "tangerang", city: "Kota Tangerang", province: "Banten", amount: 5_399_406, type: "UMK", source: wageCompilation },
  { id: "semarang", city: "Kota Semarang", province: "Jawa Tengah", amount: 3_701_709, type: "UMK", source: wageCompilation },
  { id: "surakarta", city: "Kota Surakarta", province: "Jawa Tengah", amount: 2_570_000, type: "UMK", source: wageCompilation },
  { id: "yogyakarta", city: "Kota Yogyakarta", province: "DI Yogyakarta", amount: 2_827_593, type: "UMK", source: wageCompilation },
  { id: "surabaya", city: "Kota Surabaya", province: "Jawa Timur", amount: 5_288_796, type: "UMK", source: wageCompilation },
  { id: "malang", city: "Kota Malang", province: "Jawa Timur", amount: 3_736_101, type: "UMK", source: wageCompilation },
  { id: "kediri", city: "Kota Kediri", province: "Jawa Timur", amount: 2_742_806, type: "UMK", source: wageCompilation },
  { id: "denpasar", city: "Kota Denpasar", province: "Bali", amount: 3_499_879, type: "UMK", source: wageCompilation },
  { id: "batam", city: "Kota Batam", province: "Kepulauan Riau", amount: 5_357_982, type: "UMK", source: wageCompilation },
  { id: "pekanbaru", city: "Kota Pekanbaru", province: "Riau", amount: 3_998_179, type: "UMK", source: wageCompilation },
  { id: "palembang", city: "Kota Palembang", province: "Sumatera Selatan", amount: 4_192_837, type: "UMK", source: "https://palembang.go.id/berita/berita-132" },
  { id: "banjarmasin", city: "Kota Banjarmasin", province: "Kalimantan Selatan", amount: 3_855_894, type: "UMK", source: wageCompilation },
  { id: "balikpapan", city: "Kota Balikpapan", province: "Kalimantan Timur", amount: 3_856_694, type: "UMK", source: "https://www.niaga.asia/wp-content/uploads/2025/12/UPAH-MINIMUM-KABUPATEN-KOTA-DAN-UPAH-MINIMUM-SEKORAL-KABUPATEN-KOTA-SE-KALTIM-TAHUN-2026.pdf" },
  { id: "samarinda", city: "Kota Samarinda", province: "Kalimantan Timur", amount: 3_983_882, type: "UMK", source: "https://www.niaga.asia/wp-content/uploads/2025/12/UPAH-MINIMUM-KABUPATEN-KOTA-DAN-UPAH-MINIMUM-SEKORAL-KABUPATEN-KOTA-SE-KALTIM-TAHUN-2026.pdf" },
  { id: "makassar", city: "Kota Makassar", province: "Sulawesi Selatan", amount: 4_148_179, type: "UMK", source: wageCompilation },
  { id: "palu", city: "Kota Palu", province: "Sulawesi Tengah", amount: 3_619_467, type: "UMK", source: wageCompilation },
];

export const investments = {
  sbn: {
    id: "sbn",
    name: "SBN Ritel",
    short: "SBR014T4",
    grossYield: 6.35,
    netYield: 5.715,
    note: "Kupon minimum 6,35% bruto; simulasi memakai 5,715% setelah pajak kupon 10%.",
    source: "https://djppr.kemenkeu.go.id/savingsbondritel",
  },
  rdpu: {
    id: "rdpu",
    name: "RD Pasar Uang",
    short: "Asumsi konservatif",
    grossYield: 5.25,
    netYield: 5.25,
    note: "Asumsi 5,25% per tahun, di bawah BI-Rate 5,75%. Hasil produk nyata berubah dan tidak dijamin.",
    source: "https://www.bi.go.id/id/statistik/indikator/Default.aspx",
  },
} as const;

export const referenceData = {
  asOf: "14 Juli 2026",
  lifeExpectancy: 73.93,
  inflation: 3.34,
  gold10g: 26_350_000,
  car: 281_600_000,
  house: 600_000_000,
};

export const methodologySources = [
  {
    label: "BPS — UHH Indonesia 2025: 73,93 tahun",
    url: "https://www.bps.go.id/id/pressrelease/2025/11/05/2480/indeks-pembangunan-manusia--ipm-.html",
  },
  {
    label: "BI — BI-Rate 5,75% dan inflasi 3,34%",
    url: "https://www.bi.go.id/id/statistik/indikator/Default.aspx",
  },
  {
    label: "DJPPR — kupon minimum SBR014",
    url: "https://djppr.kemenkeu.go.id/savingsbondritel",
  },
  {
    label: "BKN — batas pensiun Guru 60 tahun",
    url: "https://www.bkn.go.id/cek-batas-usia-pensiun-pns-berdasarkan-jenis-jabatan/",
  },
  {
    label: "BPJS — usia pensiun pekerja 59 tahun",
    url: "https://www.bpjsketenagakerjaan.go.id/artikel/18905/artikel-prosedur-klaim-jaminan-pensiun-%28jp%29-bpjs-ketenagakerjaan.bpjs",
  },
  {
    label: "UU 5/2026 — batas pensiun Polri terbaru",
    url: "https://peraturan.bpk.go.id/Details/350096/uu-no-5-tahun-2026",
  },
  {
    label: "Harga emas Antam 13 Juli 2026",
    url: "https://www.industry.co.id/read/153078/harga-emas-hari-ini-14-juli-2026-antam-ubs-dan-galeri-24-lengkap",
  },
];
