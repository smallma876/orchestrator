import { Route, Routes } from "react-router";
import MicrofrontendLoader from "./MicrofrontendLoader";

const microfrontends = [
  {
    name: "microfrontend-one",
    path: "app-1",
    // Relativo: mismo origen que el shell, el edge nginx lo resuelve
    // haciendo proxy_pass hacia el contenedor de microfrontend-one.
    basePath: "/microfrontend-one",
  },
];

const MicrofrontendRouter = () => {
  return (
    <Routes>
      {microfrontends.map((mf) => (
        <Route
          key={mf.path}
          path={`${mf.path}/*`}
          element={
            <MicrofrontendLoader name={mf.name} basePath={mf.basePath} />
          }
        />
      ))}
    </Routes>
  );
};

export default MicrofrontendRouter;
