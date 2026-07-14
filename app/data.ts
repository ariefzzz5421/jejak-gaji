export type ProfessionSlug = "guru" | "polisi" | "tni" | "upah-minimum" | "freelance";

export type SalaryOption = {
  id: string;
  label: string;
  group: string;
  salary: number;
  startAge?: number;
  retirementAge?: number;
  retirementRule?: string;
};

export type Profession = {
  slug: ProfessionSlug;
  name: string;
  navName: string;
  eyebrow: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  softAccent: string;
  defaultSalary: number;
  startAge: number;
  retirementAge: number;
  annualPayments: number;
  benchmarkLabel: string;
  benchmarkYear: number;
  retirementRule: string;
  retirementIsTarget?: boolean;
  salaryBasis: string;
  salaryNote: string;
  salarySource: string;
  salaryOptions?: SalaryOption[];
  defaultSalaryOptionId?: string;
};

const pnsTeacherGrades: SalaryOption[] = [
  { id: "iii-a", label: "Golongan III/a", group: "PNS Golongan III", salary: 2_785_700 },
  { id: "iii-b", label: "Golongan III/b", group: "PNS Golongan III", salary: 2_903_600 },
  { id: "iii-c", label: "Golongan III/c", group: "PNS Golongan III", salary: 3_026_400 },
  { id: "iii-d", label: "Golongan III/d", group: "PNS Golongan III", salary: 3_154_400 },
  { id: "iv-a", label: "Golongan IV/a", group: "PNS Golongan IV", salary: 3_287_800 },
  { id: "iv-b", label: "Golongan IV/b", group: "PNS Golongan IV", salary: 3_426_900 },
  { id: "iv-c", label: "Golongan IV/c", group: "PNS Golongan IV", salary: 3_571_900 },
  { id: "iv-d", label: "Golongan IV/d", group: "PNS Golongan IV", salary: 3_723_000 },
  { id: "iv-e", label: "Golongan IV/e", group: "PNS Golongan IV", salary: 3_880_400 },
];

const polriRanks: SalaryOption[] = [
  { id: "bharada", label: "Bharada", group: "Tamtama", salary: 2_272_100, retirementAge: 59, retirementRule: "BUP Tamtama Polri 59 tahun" },
  { id: "bharatu", label: "Bharatu", group: "Tamtama", salary: 2_343_100, retirementAge: 59, retirementRule: "BUP Tamtama Polri 59 tahun" },
  { id: "bharaka", label: "Bharaka", group: "Tamtama", salary: 2_416_400, retirementAge: 59, retirementRule: "BUP Tamtama Polri 59 tahun" },
  { id: "abripda", label: "Abripda", group: "Tamtama", salary: 2_492_000, retirementAge: 59, retirementRule: "BUP Tamtama Polri 59 tahun" },
  { id: "abriptu", label: "Abriptu", group: "Tamtama", salary: 2_570_000, retirementAge: 59, retirementRule: "BUP Tamtama Polri 59 tahun" },
  { id: "abrip", label: "Abrip", group: "Tamtama", salary: 2_650_300, retirementAge: 59, retirementRule: "BUP Tamtama Polri 59 tahun" },
  { id: "bripda", label: "Bripda", group: "Bintara", salary: 2_272_100, retirementAge: 59, retirementRule: "BUP Bintara Polri 59 tahun" },
  { id: "briptu", label: "Briptu", group: "Bintara", salary: 2_343_100, retirementAge: 59, retirementRule: "BUP Bintara Polri 59 tahun" },
  { id: "brigpol", label: "Brigpol", group: "Bintara", salary: 2_416_400, retirementAge: 59, retirementRule: "BUP Bintara Polri 59 tahun" },
  { id: "bripka", label: "Bripka", group: "Bintara", salary: 2_492_000, retirementAge: 59, retirementRule: "BUP Bintara Polri 59 tahun" },
  { id: "aipda", label: "Aipda", group: "Bintara", salary: 2_570_000, retirementAge: 59, retirementRule: "BUP Bintara Polri 59 tahun" },
  { id: "aiptu", label: "Aiptu", group: "Bintara", salary: 2_650_300, retirementAge: 59, retirementRule: "BUP Bintara Polri 59 tahun" },
  { id: "ipda", label: "Ipda", group: "Perwira", salary: 2_954_200, startAge: 22, retirementAge: 60, retirementRule: "BUP Perwira Polri 60 tahun" },
  { id: "iptu", label: "Iptu", group: "Perwira", salary: 3_046_600, startAge: 22, retirementAge: 60, retirementRule: "BUP Perwira Polri 60 tahun" },
  { id: "akp", label: "AKP", group: "Perwira", salary: 3_141_900, startAge: 22, retirementAge: 60, retirementRule: "BUP Perwira Polri 60 tahun" },
  { id: "kompol", label: "Kompol", group: "Perwira", salary: 3_240_200, startAge: 22, retirementAge: 60, retirementRule: "BUP Perwira Polri 60 tahun" },
  { id: "akbp", label: "AKBP", group: "Perwira", salary: 3_341_500, startAge: 22, retirementAge: 60, retirementRule: "BUP Perwira Polri 60 tahun" },
  { id: "kombes", label: "Kombes", group: "Perwira", salary: 3_446_000, startAge: 22, retirementAge: 60, retirementRule: "BUP Perwira Polri 60 tahun" },
];

const tniRanks: SalaryOption[] = [
  { id: "prada", label: "Prada", group: "Tamtama", salary: 2_272_100, retirementAge: 55, retirementRule: "BUP Tamtama TNI 55 tahun" },
  { id: "pratu", label: "Pratu", group: "Tamtama", salary: 2_343_100, retirementAge: 55, retirementRule: "BUP Tamtama TNI 55 tahun" },
  { id: "praka", label: "Praka", group: "Tamtama", salary: 2_416_400, retirementAge: 55, retirementRule: "BUP Tamtama TNI 55 tahun" },
  { id: "kopda", label: "Kopda", group: "Tamtama", salary: 2_492_000, retirementAge: 55, retirementRule: "BUP Tamtama TNI 55 tahun" },
  { id: "koptu", label: "Koptu", group: "Tamtama", salary: 2_570_000, retirementAge: 55, retirementRule: "BUP Tamtama TNI 55 tahun" },
  { id: "kopka", label: "Kopka", group: "Tamtama", salary: 2_650_300, retirementAge: 55, retirementRule: "BUP Tamtama TNI 55 tahun" },
  { id: "serda", label: "Serda", group: "Bintara", salary: 2_272_100, retirementAge: 55, retirementRule: "BUP Bintara TNI 55 tahun" },
  { id: "sertu", label: "Sertu", group: "Bintara", salary: 2_343_100, retirementAge: 55, retirementRule: "BUP Bintara TNI 55 tahun" },
  { id: "serka", label: "Serka", group: "Bintara", salary: 2_416_400, retirementAge: 55, retirementRule: "BUP Bintara TNI 55 tahun" },
  { id: "serma", label: "Serma", group: "Bintara", salary: 2_492_000, retirementAge: 55, retirementRule: "BUP Bintara TNI 55 tahun" },
  { id: "pelda", label: "Pelda", group: "Bintara", salary: 2_570_000, retirementAge: 55, retirementRule: "BUP Bintara TNI 55 tahun" },
  { id: "peltu", label: "Peltu", group: "Bintara", salary: 2_650_300, retirementAge: 55, retirementRule: "BUP Bintara TNI 55 tahun" },
  { id: "letda", label: "Letda", group: "Perwira", salary: 2_954_200, startAge: 22, retirementAge: 58, retirementRule: "BUP Perwira TNI sampai Kolonel 58 tahun" },
  { id: "lettu", label: "Lettu", group: "Perwira", salary: 3_046_600, startAge: 22, retirementAge: 58, retirementRule: "BUP Perwira TNI sampai Kolonel 58 tahun" },
  { id: "kapten", label: "Kapten", group: "Perwira", salary: 3_141_900, startAge: 22, retirementAge: 58, retirementRule: "BUP Perwira TNI sampai Kolonel 58 tahun" },
  { id: "mayor", label: "Mayor", group: "Perwira", salary: 3_240_200, startAge: 22, retirementAge: 58, retirementRule: "BUP Perwira TNI sampai Kolonel 58 tahun" },
  { id: "letkol", label: "Letkol", group: "Perwira", salary: 3_341_500, startAge: 22, retirementAge: 58, retirementRule: "BUP Perwira TNI sampai Kolonel 58 tahun" },
  { id: "kolonel", label: "Kolonel", group: "Perwira", salary: 3_446_000, startAge: 22, retirementAge: 58, retirementRule: "BUP Perwira TNI sampai Kolonel 58 tahun" },
];

export const professions: Record<ProfessionSlug, Profession> = {
  guru: {
    slug: "guru",
    name: "Guru ASN",
    navName: "Guru",
    eyebrow: "Jalur pendidikan",
    tagline: "Berapa nilai satu masa bakti seorang guru?",
    description:
      "Benchmark otomatis Guru ASN memakai gaji pokok awal PNS Golongan III/a. Tunjangan sertifikasi dan daerah tidak dimasukkan agar estimasi tetap konservatif.",
    image: "/professions/guru.png",
    accent: "#9c451f",
    softAccent: "#f6dfcf",
    defaultSalary: 2_785_700,
    startAge: 23,
    retirementAge: 60,
    annualPayments: 14,
    benchmarkLabel: "PNS Golongan III/a · masa kerja 0 tahun",
    benchmarkYear: 2024,
    retirementRule: "BUP Guru ASN 60 tahun",
    salaryBasis: "Benchmark otomatis Rp2.785.700/bulan",
    salaryNote:
      "PP 5/2024 menetapkan gaji pokok awal PNS Golongan III/a Rp2.785.700. Nilai riil dapat lebih tinggi karena masa kerja, sertifikasi, dan tunjangan daerah.",
    salarySource: "https://peraturan.bpk.go.id/Details/276755/pp-no-5-tahun-2024",
    salaryOptions: pnsTeacherGrades,
    defaultSalaryOptionId: "iii-a",
  },
  polisi: {
    slug: "polisi",
    name: "Anggota Polri",
    navName: "Polisi",
    eyebrow: "Jalur kepolisian",
    tagline: "Lihat nilai ekonomi dari puluhan tahun dinas.",
    description:
      "Benchmark otomatis anggota Polri jalur Bripda memakai gaji pokok awal resmi. Tunjangan kinerja, jabatan, dan wilayah tidak dimasukkan.",
    image: "/professions/polisi.png",
    accent: "#174b3d",
    softAccent: "#d7e9df",
    defaultSalary: 2_272_100,
    startAge: 19,
    retirementAge: 59,
    annualPayments: 14,
    benchmarkLabel: "Bripda · masa kerja 0 tahun",
    benchmarkYear: 2024,
    retirementRule: "BUP Bintara/Tamtama Polri 59 tahun",
    salaryBasis: "Benchmark otomatis Rp2.272.100/bulan",
    salaryNote:
      "PP 7/2024 menetapkan gaji pokok awal Bripda Rp2.272.100. UU 5/2026 menetapkan BUP Bintara/Tamtama 59 tahun; Perwira umumnya 60 tahun.",
    salarySource: "https://peraturan.bpk.go.id/Details/276772/pp-no-7-tahun-2024",
    salaryOptions: polriRanks,
    defaultSalaryOptionId: "bripda",
  },
  tni: {
    slug: "tni",
    name: "Prajurit TNI",
    navName: "TNI",
    eyebrow: "Jalur pertahanan",
    tagline: "Hitung masa dinas, penghasilan, dan masa pensiun.",
    description:
      "Benchmark otomatis prajurit TNI jalur Serda memakai gaji pokok awal resmi dan batas usia pensiun Bintara/Tamtama.",
    image: "/professions/tni.png",
    accent: "#42512d",
    softAccent: "#e0e6d3",
    defaultSalary: 2_272_100,
    startAge: 19,
    retirementAge: 55,
    annualPayments: 14,
    benchmarkLabel: "Serda · masa kerja 0 tahun",
    benchmarkYear: 2024,
    retirementRule: "BUP Bintara/Tamtama TNI 55 tahun",
    salaryBasis: "Benchmark otomatis Rp2.272.100/bulan",
    salaryNote:
      "PP 6/2024 menetapkan gaji pokok awal Serda Rp2.272.100. UU 3/2025 menetapkan BUP Bintara/Tamtama 55 tahun dan Perwira sampai Kolonel 58 tahun.",
    salarySource: "https://peraturan.bpk.go.id/Details/276758/pp-no-6-tahun-2024",
    salaryOptions: tniRanks,
    defaultSalaryOptionId: "serda",
  },
  "upah-minimum": {
    slug: "upah-minimum",
    name: "Pekerja Upah Minimum",
    navName: "UMK / UMP",
    eyebrow: "Jalur pekerja daerah",
    tagline: "Mulai dari kota tempatmu bekerja.",
    description:
      "Pilih kota untuk mengisi UMK atau UMP 2026 secara otomatis. Nilai berlaku sebagai batas minimum bagi pekerja dengan masa kerja kurang dari satu tahun.",
    image: "/professions/upah-minimum.png",
    accent: "#29476d",
    softAccent: "#dce8f4",
    defaultSalary: 2_742_806,
    startAge: 20,
    retirementAge: 59,
    annualPayments: 13,
    benchmarkLabel: "UMK Kota Kediri · pekerja <1 tahun",
    benchmarkYear: 2026,
    retirementRule: "Usia pensiun program JP 59 tahun",
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
      "Benchmark otomatis pekerja mandiri memakai rata-rata pendapatan bersih nasional terbaru. Angka ini adalah proksi, bukan tarif baku freelancer digital.",
    image: "/professions/freelance.png",
    accent: "#6a3f72",
    softAccent: "#eaddef",
    defaultSalary: 1_920_000,
    startAge: 20,
    retirementAge: 60,
    annualPayments: 12,
    benchmarkLabel: "Pekerja berusaha sendiri · rata-rata nasional",
    benchmarkYear: 2026,
    retirementRule: "Target pensiun mandiri 60 tahun",
    retirementIsTarget: true,
    salaryBasis: "Benchmark BPS Rp1,92 juta/bulan",
    salaryNote:
      "Sakernas/BPS Februari 2026 mencatat rata-rata pendapatan pekerja berusaha sendiri Rp1,92 juta per bulan. Freelancer nyata sangat bervariasi dan tidak memiliki BUP wajib.",
    salarySource: "https://www.bps.go.id/id/statistics-table/2/NTY2IzI%3D/rata-rata-pendapatan-bersih-sebulan-pekerja-berusaha-sendiri-menurut-lapangan-pekerjaan-utama.html",
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
  currentYear: 2026,
  asOf: "14 Juli 2026",
  lifeExpectancy: 73.93,
  inflation: 3.34,
  gold10g: 26_350_000,
  car: 281_600_000,
  house: 600_000_000,
};

export const methodologySources = [
  {
    label: "Yahoo Finance API — USD/IDR dan IHSG",
    url: "https://query1.finance.yahoo.com/v8/finance/chart/%5EJKSE",
  },
  {
    label: "BI dan Logam Mulia — feed suku bunga serta Antam",
    url: "https://www.bi.go.id/id/statistik/indikator/Default.aspx",
  },
  {
    label: "BPS — UHH Indonesia 2025: 73,93 tahun",
    url: "https://www.bps.go.id/id/pressrelease/2025/11/05/2480/indeks-pembangunan-manusia--ipm-.html",
  },
  {
    label: "BKN — batas pensiun Guru 60 tahun",
    url: "https://www.bkn.go.id/cek-batas-usia-pensiun-pns-berdasarkan-jenis-jabatan/",
  },
  {
    label: "UU 5/2026 — batas pensiun Polri terbaru",
    url: "https://peraturan.bpk.go.id/Details/350096/uu-no-5-tahun-2026",
  },
  {
    label: "UU 3/2025 — batas pensiun TNI terbaru",
    url: "https://peraturan.bpk.go.id/Details/319166/uu-no-3-tahun-2025",
  },
];
