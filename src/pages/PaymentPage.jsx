import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import * as ordersService from "../services/orders.service.js";
import { loadMtouchScript, payWithMtouch, isPublicKeyConfigured } from "../services/payment.service.js";
import { BackIcon, LockIcon } from "../components/icons/index.jsx";
import { won, genTrackId } from "../utils/format.js";

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, total, clearCart } = useCart();

  const [trackId] = useState(genTrackId);
  const [payerName, setPayerName] = useState(user?.name || "");
  const [payerTel, setPayerTel] = useState("010-1234-5678");
  const [payerEmail, setPayerEmail] = useState("");
  const [scriptStatus, setScriptStatus] = useState("loading"); // loading | ready | failed
  const [processing, setProcessing] = useState(false);
  const orderCreatedRef = useRef(false);
  const keyConfigured = isPublicKeyConfigured();

  useEffect(() => {
    loadMtouchScript().then(setScriptStatus);
  }, []);

  // 결제키 미설정은 개발자 콘솔에만 경고 — 고객 화면에는 노출하지 않음
  useEffect(() => {
    if (!keyConfigured) {
      console.warn(
        "[STAYNEST] CONFIG.PUBLIC_KEY가 비어있습니다. src/config.js에 발급받은 온라인 결제키를 입력해야 결제 버튼이 동작합니다."
      );
    }
  }, [keyConfigured]);

  // 비로그인 상태로 URL을 직접 입력해 들어온 경우도 차단
  useEffect(() => {
    if (!user) navigate("/login", { state: { from: "/payment" }, replace: true });
  }, [user, navigate]);

  // 장바구니가 비어있는데 결제페이지로 바로 들어온 경우 보호
  useEffect(() => {
    if (cart.length === 0) navigate("/cart", { replace: true });
  }, [cart, navigate]);

  const products = cart.map((c) => ({
    name: `${c.stay.name} - ${c.room.name}`,
    price: String(c.room.price),
    qty: 1,
    desc: `${c.stay.region} / ${c.room.capacity}`,
  }));

  const handlePay = useCallback(async () => {
    if (!payerName || !payerTel) return;
    if (!keyConfigured || scriptStatus !== "ready") return; // 결제 모듈/키 준비 안되면 시도 자체를 막음
    setProcessing(true);

    try {
      // 1) 결제 시도 전, 주문을 PENDING 상태로 먼저 생성
      if (!orderCreatedRef.current) {
        await ordersService.createPendingOrder({ userId: user?.id, cartItems: cart, trackId, totalAmount: total });
        orderCreatedRef.current = true;
      }

      // 2) MTouch 결제창 호출 (KWON.pay)
      const mtouchResponse = await payWithMtouch({
        amount: total,
        products,
        trackId,
        payerName,
        payerEmail,
        payerTel,
        udf1: user?.id,
        scriptStatus,
      });

      // 3) 결제 결과를 주문에 반영
      const order = await ordersService.confirmOrder(trackId, mtouchResponse);

      setProcessing(false);
      if (order.status === "PAID") {
        clearCart();
        navigate("/payment/result", { state: { status: "success", data: mtouchResponse, total, trackId } });
      } else {
        navigate("/payment/result", { state: { status: "fail", data: mtouchResponse, total, trackId } });
      }
    } catch (err) {
      setProcessing(false);
      navigate("/payment/result", { state: { status: "fail", data: null, total, trackId } });
    }
  }, [payerName, payerTel, payerEmail, total, products, scriptStatus, trackId, user, cart, clearCart, navigate, keyConfigured]);

  if (!user || cart.length === 0) return null;

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
                <span>
                  {c.stay.name} · {c.room.name}
                </span>
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
              <span>연락처</span>
              <input value={payerTel} onChange={(e) => setPayerTel(e.target.value)} placeholder="010-0000-0000" />
            </label>
            <label className="sn-field">
              <span>이메일 (선택)</span>
              <input value={payerEmail} onChange={(e) => setPayerEmail(e.target.value)} placeholder="example@email.com" />
            </label>
          </section>

          <section className="sn-pay-block sn-pay-status">
            <span className={`sn-status-dot ${scriptStatus === "ready" ? "ready" : "loading"}`} />
            <span>{scriptStatus === "ready" ? "안전한 결제 연결이 확인되었습니다" : "결제 환경을 준비하고 있습니다..."}</span>
          </section>
        </div>

        <aside className="sn-pay-side">
          <h2 className="sn-subhead">결제 요약</h2>
          <div className="sn-pay-summary-row">
            <span>주문번호(trackId)</span>
            <span>{trackId}</span>
          </div>
          <div className="sn-pay-summary-row">
            <span>결제수단</span>
            <span>온라인 신용카드 (3D 인증)</span>
          </div>
          <hr className="sn-divider" />
          <div className="sn-pay-summary-row sn-pay-total">
            <span>총 결제금액</span>
            <strong>{won(total)}</strong>
          </div>

          <button
            className="sn-cta sn-cta-block sn-pay-btn"
            disabled={!payerName || !payerTel || processing || !keyConfigured || scriptStatus !== "ready"}
            onClick={handlePay}
          >
            {processing ? "결제 진행 중..." : `${won(total)} 결제하기`}
          </button>
          <p className="sn-pay-fineprint">
            <LockIcon className="sn-icon-xs" />
            MTouch 온라인인증결제(KWON.pay) 연동입니다.
          </p>
        </aside>
      </div>
    </div>
  );
}
