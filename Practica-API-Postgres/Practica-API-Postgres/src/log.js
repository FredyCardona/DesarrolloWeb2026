import { appendFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

export async function registrarLog(ruta, texto) {
  await mkdir(dirname(ruta), { recursive: true });
  await appendFile(ruta, `[${new Date().toISOString()}] ${texto}\n`, 'utf8');
}
