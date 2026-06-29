import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import DetailPage from "./pages/DetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import EventsPage from "./pages/EventsPage.jsx";
import EventDetailPage from "./pages/EventDetailPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="sn-root">
          <Header />
          <main className="sn-main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/stays/:id" element={<DetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment/result" element={<ResultPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/events/:id" element={<EventDetailPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
