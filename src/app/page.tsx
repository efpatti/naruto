import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home } from "./pages/home";
import { Teste } from "./pages/teste";

export default function App() {
  console.log("carregado");
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Teste />
        <Home />
      </main>
      <ToastContainer />
    </>
  );
}
