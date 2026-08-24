export function hash(x: number, y: number) {
  const p = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return p - Math.floor(p);
}

function lerp(a: number, b: number, t: number) {
  return a + t * (b - a);
}

export function noise2D(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);

  const ux = fx * fx * (3.0 - 2.0 * fx);
  const uy = fy * fy * (3.0 - 2.0 * fy);

  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
}

export function fbm(x: number, y: number, octaves: number) {
  let v = 0;
  let a = 0.5;
  let shift = 100.0;
  for (let i = 0; i < octaves; i++) {
    v += a * noise2D(x, y);
    x = x * 2.0 + shift;
    y = y * 2.0 + shift;
    a *= 0.5;
  }
  return v; // Max value approaches 1.0 (0.5 + 0.25 + 0.125 + ...)
}

export function getHeightAt(x: number, z: number) {
  // 4 octaves of noise for general hills
  let h = fbm(x * 0.015, z * 0.015, 4); 
  
  const dist = Math.sqrt(x * x + z * z);
  
  // Center is perfectly flat for village
  let blend = (dist - 40) / 30;
  if (blend > 1) blend = 1;
  if (blend < 0) blend = 0;
  blend = blend * blend * (3 - 2 * blend);
  
  // Macro-scale landscape: terrain drops towards the back (-Z) and right (+X) to form a natural rugged shoreline
  let macro = (z * 0.04) + (x * 0.02) - 3.0; 
  if (macro > 5) macro = 5;
  
  // Base target height (organic hills)
  let targetH = (h * 50 - 15) + macro;
  
  return 2.0 * (1 - blend) + targetH * blend;
}

export const WATER_LEVEL = -1.5;

export function getSlopeAt(x: number, z: number) {
  const delta = 0.1;
  const h = getHeightAt(x, z);
  const hx = getHeightAt(x + delta, z);
  const hz = getHeightAt(x, z + delta);
  return Math.max(Math.abs(hx - h), Math.abs(hz - h)) / delta;
}

export function isValidSpawnPoint(x: number, z: number, type: 'tree' | 'building' = 'tree') {
  const h = getHeightAt(x, z);
  
  // margin (запас): objects don't spawn exactly at the water edge
  if (h < WATER_LEVEL + 1.5) return false; 
  
  if (type === 'tree') {
    // Alpine line
    if (h > 40) return false; 
    
    // Natural clearings (Poisson-disc like grouping) using noise
    let density = fbm(x * 0.05, z * 0.05 + 100, 2);
    
    // Lower density on steep slopes (y higher = less trees)
    let densityThreshold = 0.3 + (h / 40) * 0.3; 
    
    // Чем ближе к воде (в полосе 5м), тем реже деревья (~20% вероятности)
    if (h < WATER_LEVEL + 6.5) {
      densityThreshold += (WATER_LEVEL + 6.5 - h) * 0.15; 
    }
    
    if (density < densityThreshold) return false; // Creates clearings
  }

  return true;
}
