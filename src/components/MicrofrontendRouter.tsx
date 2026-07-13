import { Route, Routes } from "react-router";
import MicrofrontendLoader from "./MicrofrontendLoader";

const microfrontends = [
  {
    path: "u",
    src: "http://localhost:8081/index-CH-jQgBV.js",
  },
];

const MicrofrontendRouter = () => {
  return (
    <Routes>
      {microfrontends.map((mf) => (
        <Route
          key={mf.path}
          path={mf.path}
          element={<MicrofrontendLoader src={mf.src} />}
        />
      ))}
    </Routes>
  );
};

export default MicrofrontendRouter;
