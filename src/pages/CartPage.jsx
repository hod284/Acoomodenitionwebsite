import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { TrashIcon } from "../components/icons/index.jsx";
import { won } from "../utils/format.js";

export default function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, total, removeFromCart } = useCart();

  // 장바구니 화면 자체를 비로그인 상태로는 볼 수 없게 함 — 진입 즉시 로그인으로 이동
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" }, replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    navigate("/payment");
  };

  return (
    <div className="sn-cart-page">
      <h1>장바구니</h1>

      {cart.length === 0 ? (
        <div className="sn-empty">
          <p>아직 담은 숙소가 없어요.</p>
          <button className="sn-cta" onClick={() => navigate("/")}>
            숙소 둘러보기
          </button>
        </div>
      ) : (
        <>
          <div className="sn-cart-list">
            {cart.map((c) => (
              <div key={c.cartId} className="sn-cart-item">
                <img src={c.stay.cover} alt="" />
                <div className="sn-cart-item-info">
                  <p className="sn-cart-item-name">{c.stay.name}</p>
                  <p className="sn-cart-item-room">
                    {c.room.name} · {c.room.capacity}
                  </p>
                  <p className="sn-cart-item-price">{won(c.room.price)}</p>
                </div>
                <button className="sn-iconbtn-sm" onClick={() => removeFromCart(c.cartId)} aria-label="삭제">
                  <TrashIcon className="sn-icon-sm" />
                </button>
              </div>
            ))}
          </div>

          <div className="sn-cart-summary">
            <span>총 결제 금액</span>
            <strong>{won(total)}</strong>
          </div>

          <button className="sn-cta sn-cta-block" onClick={handleCheckout}>
            결제하기
          </button>
        </>
      )}
    </div>
  );
}
