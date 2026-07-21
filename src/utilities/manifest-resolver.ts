interface ViteManifestChunk {
  file: string;
  isEntry?: boolean;
}

type ViteManifest = Record<string, ViteManifestChunk>;

const entryUrlCache = new Map<string, Promise<string>>();

/**
 * Resuelve el archivo de entrada real (con hash) de un microfrontend a partir
 * de su `basePath` (ej. "/microfrontend-one", o una URL completa si el
 * microfrontend vive en otro origen), leyendo el manifest.json que genera
 * Vite en cada build. Cachea la promesa por basePath para no repetir el
 * fetch en cada mount.
 */
export function resolveMicrofrontendEntry(basePath: string): Promise<string> {
  let promise = entryUrlCache.get(basePath);

  if (!promise) {
    promise = fetch(`${basePath}/.vite/manifest.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `No se pudo obtener el manifest de "${basePath}" (HTTP ${response.status}).`,
          );
        }

        return response.json() as Promise<ViteManifest>;
      })
      .then((manifest) => {
        const entry = Object.values(manifest).find((chunk) => chunk.isEntry);

        if (!entry) {
          throw new Error(`El manifest de "${basePath}" no tiene un entry marcado.`);
        }

        return `${basePath}/${entry.file}`;
      })
      .catch((error: unknown) => {
        // No cachear fallos: un problema transitorio de red no debe
        // envenenar la resolución para siempre.
        entryUrlCache.delete(basePath);
        throw error;
      });

    entryUrlCache.set(basePath, promise);
  }

  return promise;
}
