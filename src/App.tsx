import { BrowserRouter } from "react-router-dom";
import Navbar from "./compenents/Navbar";
import Footer from "./compenents/Footer";
import AppRoutes from "./routes/AppRoutes";
import { useAppSelector } from "./store/hooks";

function App() {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;