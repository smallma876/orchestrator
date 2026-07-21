/** Contrato que cada microfrontend debe implementar en su entry point */
export interface MicrofrontendLifecycle {
  /** Inicialización única (ej. configurar i18n, store). Opcional. */
  bootstrap?: () => Promise<void> | void;
  /** Se ejecuta en cada navegación hacia la ruta de este microfrontend */
  mount: (
    container: HTMLElement,
    props: Record<string, unknown>,
  ) => Promise<void> | void;
  /** Se ejecuta al salir de la ruta; debe limpiar listeners, timers, etc. */
  unmount: (container: HTMLElement) => Promise<void> | void;
}

/**
 * PASO 2: El registro.
 * Es el "directorio telefónico" donde cada microfrontend se anota
 * a sí mismo apenas se ejecuta su script. Vive en `window` porque
 * el shell y los microfrontends corren en el mismo documento HTML,
 * pero son bundles de JS completamente separados.
 */
declare global {
  interface Window {
    __MFE_REGISTRY__?: MicrofrontendRegistry;
  }
}

export class MicrofrontendRegistry {
  private static instance: MicrofrontendRegistry;

  private readonly lifecycles = new Map<string, MicrofrontendLifecycle>();

  static getInstance(): MicrofrontendRegistry {
    if (!MicrofrontendRegistry.instance) {
      MicrofrontendRegistry.instance = new MicrofrontendRegistry();
      window.__MFE_REGISTRY__ = MicrofrontendRegistry.instance;
    }

    return MicrofrontendRegistry.instance;
  }

  register(name: string, lifecycle: MicrofrontendLifecycle): void {
    if (
      typeof lifecycle.mount !== "function" ||
      typeof lifecycle.unmount !== "function"
    ) {
      throw new Error(
        `Invalid lifecycle object for microfrontend "${name}". Both "mount" and "unmount" methods must be provided.`,
      );
    }

    this.lifecycles.set(name, lifecycle);
  }

  get(name: string): MicrofrontendLifecycle {
    const lifecycle = this.lifecycles.get(name);
    if (!lifecycle) {
      throw new Error(`Microfrontend "${name}" is not registered.`);
    }

    return lifecycle;
  }
}

export class MicrofrontendOrchestrator {
  private readonly registry: MicrofrontendRegistry;
  private readonly bootstrappedApps = new Set<string>();
  private activeApp: { name: string; container: HTMLElement } | null = null;

  constructor(
    registry: MicrofrontendRegistry = MicrofrontendRegistry.getInstance(),
  ) {
    this.registry = registry;
  }

  async mount(
    name: string,
    container: HTMLElement,
    customProps: Record<string, unknown> = {},
  ): Promise<void> {
    const lifecycle = this.registry.get(name);

    if (!this.bootstrappedApps.has(name)) {
      await lifecycle.bootstrap?.();
      this.bootstrappedApps.add(name);
    }

    await this.unmountActive();

    await lifecycle.mount(container, customProps);
    this.activeApp = { name, container };
  }

  async unmountActive(): Promise<void> {
    if (!this.activeApp) return;

    const { name, container } = this.activeApp;
    const lifecycle = this.registry.get(name);

    try {
      await lifecycle.unmount(container);
    } catch (error) {
      console.error(`Error unmounting microfrontend "${name}":`, error);
    } finally {
      this.activeApp = null;
    }
  }
}
