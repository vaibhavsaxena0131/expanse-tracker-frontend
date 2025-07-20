import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;