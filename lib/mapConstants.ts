/**
 * Konfigurasi Geografis & Batas Wilayah Fakultas Teknik Universitas Tadulako (Untad)
 * Digunakan untuk membatasi interaksi peta (MapPicker & DashboardMap) serta memotong (crop) visual area luar.
 */

// Titik Pusat Fakultas Teknik Untad
export const FATEK_CENTER: [number, number] = [-0.840622, 119.893536];

// Batas Wilayah Fakultas Teknik Untad [South-West, North-East]
// - Selatan: -0.8436 (Jalan Untad I)
// - Utara:   -0.8385 (Batas utara gedung Fatek sebelum FMIPA)
// - Barat:   119.8908 (Batas barat Untad I / Soekarno-Hatta)
// - Timur:   119.8950 (Batas jalan timur Fatek sebelum Pascasarjana & Kedokteran)
export const FATEK_BOUNDS: [[number, number], [number, number]] = [
  [-0.8436, 119.8908], // Barat Daya
  [-0.8385, 119.8950], // Timur Laut
];

// Batas Geser Peta (Pan Bounds) dengan bantalan lembut agar kamera tetap fokus pada Fatek tanpa glitch
export const FATEK_PAN_BOUNDS: [[number, number], [number, number]] = [
  [-0.8490, 119.8850], // Barat Daya (sedikit di luar Fatek untuk navigasi mulus)
  [-0.8330, 119.9010], // Timur Laut
];

// Konfigurasi Level Zoom
export const FATEK_MIN_ZOOM = 16;
export const FATEK_MAX_ZOOM = 19;
export const FATEK_DEFAULT_ZOOM = 17;

// Rentang luar untuk pemotongan (crop) visual area sekeliling
const MASK_OUTER_NORTH = 1.0;
const MASK_OUTER_SOUTH = -2.0;
const MASK_OUTER_WEST = 118.0;
const MASK_OUTER_EAST = 122.0;

/**
 * 4 Kotak Pemotong (Crop Mask Rectangles) di sekeliling Fakultas Teknik Untad.
 * Menggunakan 4 rectangle cembung terpisah (bukan poligon berlubang), sehingga
 * 100% aman dan tidak akan pernah menyebabkan bug "map hilang saat zoom in" pada Leaflet.
 */
export const FATEK_CROP_MASKS: [[number, number], [number, number]][] = [
  // Sisi Utara (North Mask)
  [
    [FATEK_BOUNDS[1][0], MASK_OUTER_WEST],
    [MASK_OUTER_NORTH, MASK_OUTER_EAST],
  ],
  // Sisi Selatan (South Mask)
  [
    [MASK_OUTER_SOUTH, MASK_OUTER_WEST],
    [FATEK_BOUNDS[0][0], MASK_OUTER_EAST],
  ],
  // Sisi Barat (West Mask)
  [
    [FATEK_BOUNDS[0][0], MASK_OUTER_WEST],
    [FATEK_BOUNDS[1][0], FATEK_BOUNDS[0][1]],
  ],
  // Sisi Timur (East Mask)
  [
    [FATEK_BOUNDS[0][0], FATEK_BOUNDS[1][1]],
    [FATEK_BOUNDS[1][0], MASK_OUTER_EAST],
  ],
];

/**
 * Memeriksa apakah koordinat [lat, lng] berada dalam kawasan Fakultas Teknik Untad
 */
export function isWithinFatekBounds(lat: number, lng: number): boolean {
  return (
    lat >= FATEK_BOUNDS[0][0] &&
    lat <= FATEK_BOUNDS[1][0] &&
    lng >= FATEK_BOUNDS[0][1] &&
    lng <= FATEK_BOUNDS[1][1]
  );
}
