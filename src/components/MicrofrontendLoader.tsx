import { useEffect, useRef } from "react";
import { createScript } from "../utilities/scripting-styling-creator";
import { MicrofrontendOrchestrator } from "../utilities/microfrontend-registry";
import { resolveMicrofrontendEntry } from "../utilities/manifest-resolver";

export interface MicrofrontendLoaderProps {
  name: string;
  basePath: string;
  props?: Record<string, unknown>;
}

// El script de un microfrontend solo debe inyectarse (y ejecutarse) una vez;
// solo su `register()` es idempotente, no su carga de red/side-effects.
const loadedScripts = new Set<string>();
const orchestrator = new MicrofrontendOrchestrator();

const MicrofrontendLoader = ({ name, basePath, props }: MicrofrontendLoaderProps) => {
  const containerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    resolveMicrofrontendEntry(basePath)
      .then((src) => {
        if (cancelled) return;

        const mountApp = () => {
          if (!cancelled) orchestrator.mount(name, container, props);
        };

        if (loadedScripts.has(src)) {
          mountApp();
        } else {
          const script = createScript(src);
          script.onload = () => {
            loadedScripts.add(src);
            mountApp();
          };
          document.body.appendChild(script);
        }
      })
      .catch((error: unknown) => {
        console.error(`Error cargando el microfrontend "${name}":`, error);
      });

    return () => {
      cancelled = true;
      orchestrator.unmountActive();
    };
  }, [name, basePath, props]);

  return <main ref={containerRef} className="microfrontend-container" />;
};

export default MicrofrontendLoader;
