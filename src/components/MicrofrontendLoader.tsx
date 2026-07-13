import { useEffect } from "react";
import { createScript } from "../utilities/scripting-styling-creator";

export interface MicrofrontendLoaderProps {
  src: string;
}

const MicrofrontendLoader = ({ src }: MicrofrontendLoaderProps) => {
  useEffect(() => {
    const script = createScript(src);

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src]);

  return <main id="root" className="microfrontend-container" />;
};

export default MicrofrontendLoader;
