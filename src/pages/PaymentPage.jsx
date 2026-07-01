import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import * as ordersService from "../services/orders.service.js";
import { payWithKwon } from "../services/payment.service.js";
import { BackIcon, LockIcon } from "../components/icons/index.jsx";
import { won, genTrackId } from "../utils/format.js";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, total } = useCart();

  const [orderNo] = useState(genTrackId);
  const [payerName, setPayerName] = useState(user?.name || "");
  const [payerEmail, setPayerEmail] = useState("");
  const [processing, setProcessing] = useState(false);
  const orderCreatedRef = useRef(false);

  // 비로그인 차단
  useEffect(() => {
    if (!user) navigate("/login", { state: { from: "/payment" }, replace: true });
  }, [user, navigate]);

  // 빈 장바구니 차단
  useEffect(() => {
    if (cart.length === 0) navigate("/cart", { replace: true });
  }, [cart, navigate]);

  if (!user || cart.length === 0) return null;

  // 상품명: 장바구니 상품들을 / 로 이어붙임
  const productName = cart.map((c) => `${c.stay.name}-${c.room.name}`).join(" / ");

  const handlePay = useCallback(async () => {
    if (!payerName) return;
    setProcessing(true);

    try {
      // 1) 결제 시도 전, 주문을 PENDING 상태로 먼저 생성
      if (!orderCreatedRef.current) {
        await ordersService.createPendingOrder({
          userId: user?.id,
          cartItems: cart,
          trackId: orderNo,
          totalAmount: total,
        });
        orderCreatedRef.current = true;
      }

      // 2) 결제창 호출
      //    form submit 방식이라 이 함수 호출 후 페이지가 결제창으로 이동합니다.
      //    결제 완료/취소 후 payCompleteUrl / payCancelUrl로 돌아옵니다.
      await payWithKwon({
        orderNo,
        amount: total,
        product: productName,
        userName: payerName,
        userId: user?.id || "",
        userEmail: payerEmail,
        // 결제 완료/취소 후 돌아올 URL (현재 도메인 기준)
        payCompleteUrl: `${window.location.origin}/payment/result`,
        payCancelUrl: `${window.location.origin}/payment/result`,
      });

    } catch (err) {
      console.error("[STAYNEST] 결제 처리 중 오류:", err);
      setProcessing(false);
      if (err.message === "POPUP_BLOCKED") {
        alert("팝업이 차단되었습니다. 브라우저 팝업 차단을 해제해주세요.");
        return;
      }
      navigate("/payment/result", {
        state: { status: "fail", data: null, total, trackId: orderNo, errorMessage: err?.message },
      });
    }
  }, [payerName, payerEmail, total, productName, orderNo, user, cart, navigate]);

  return (
    <div className="sn-pay-page">
      <button className="sn-backbtn" onClick={() => navigate("/cart")}>
        <BackIcon className="sn-icon-sm" />
        장바구니로
      </button>
      <h1>결제하기</h1>

      <div className="sn-pay-grid">
        <div className="sn-pay-main">
          <section className="sn-pay-block">
            <h2 className="sn-subhead">예약 상품</h2>
            {cart.map((c) => (
              <div key={c.cartId} className="sn-pay-row">
                <span>{c.stay.name} · {c.room.name}</span>
                <strong>{won(c.room.price)}</strong>
              </div>
            ))}
          </section>

          <section className="sn-pay-block">
            <h2 className="sn-subhead">예약자 정보</h2>
            <label className="sn-field">
              <span>이름</span>
              <input value={payerName} onChange={(e) => setPayerName(e.target.value)} />
            </label>
            <label className="sn-field">
              <span>이메일 (선택)</span>
              <input
                value={payerEmail}
                onChange={(e) => setPayerEmail(e.target.value)}
                placeholder="example@email.com"
              />
            </label>
          </section>
        </div>

        <aside className="sn-pay-side">
          <h2 className="sn-subhead">결제 요약</h2>
          <div className="sn-pay-summary-row">
            <span>주문번호</span>
            <span>{orderNo}</span>
          </div>
          <div className="sn-pay-summary-row">
            <span>결제수단</span>
            <span>신용카드</span>
          </div>
          <hr className="sn-divider" />
          <div className="sn-pay-summary-row sn-pay-total">
            <span>총 결제금액</span>
            <strong>{won(total)}</strong>
          </div>

          <button
            className="sn-cta sn-cta-block sn-pay-btn"
            disabled={!payerName || processing}
            onClick={handlePay}
          >
            {processing ? "결제창 호출 중..." : `${won(total)} 결제하기`}
          </button>
          <p className="sn-pay-fineprint">
            <LockIcon className="sn-icon-xs" />
            케이원피에스 1차 PG 카드결제 연동입니다.
          </p>
        </aside>
      </div>
    </div>
  );
}
