import { NavLink } from "react-router";
import MicrofrontendRouter from "./components/MicrofrontendRouter";

function App() {
  return (
    <div>
      <h1>Orquestador</h1>
      <nav>
        <NavLink to="app-1" end>
          App1
        </NavLink>
        <NavLink to="app-2" end>
          App2
        </NavLink>
      </nav>
      <MicrofrontendRouter />
    </div>
  );
}

export default App;
