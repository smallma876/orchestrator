export const createScript = (url: string): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = url;
  script.async = false;
  script.type = "module";
  script.onload = () => {
    console.log(`Microfrontend loaded from ${url}`);
  };
  script.onerror = () => {
    console.error(`Failed to load microfrontend from ${url}`);
  };

  return script;
};

export const createStylesheet = (url: string): HTMLLinkElement => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = url;

  return link;
};
