import { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { CheckIcon, XIcon } from "../components/icons/index.jsx";
import { won } from "../utils/format.js";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [params, setParams] = useState(null);

  useEffect(() => {
    // 새 1차PG API는 결제 결과를 form submit(POST)으로 payCompleteUrl에 전달
    // React SPA에서는 URL 파라미터 또는 location.state 두 가지 경로로 올 수 있음

    // 1) location.state로 온 경우 (기존 에러 처리 등)
    if (location.state) {
      setParams(location.state);
      return;
    }

    // 2) URL 쿼리 파라미터로 온 경우 (form POST가 GET으로 리다이렉트된 경우 등)
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.has("status")) {
      const result = {};
      searchParams.forEach((value, key) => { result[key] = value; });
      setParams({ fromForm: true, ...result });

      // 성공이면 장바구니 비우기
      if (result.status === "SUCCESS") {
        clearCart();
      }
    }
  }, [location, clearCart]);

  // 콘솔에 결제 결과 자동 출력
  useEffect(() => {
    if (!params) return;
    const success = params.status === "SUCCESS" || params.status === "success";
    console.groupCollapsed(
      `%c[STAYNEST 결제 결과] ${success ? "✅ 성공" : "❌ 실패"} — orderNo: ${params.orderNo || params.trackId || "-"}`,
      `color: ${success ? "#2f8a5e" : "#c4392b"}; font-weight: bold;`
    );
    console.log("전체 결과:", params);
    console.groupEnd();
  }, [params]);

  // 아무 데이터도 없으면 홈으로
  if (!params && !location.state && !location.search) {
    return <Navigate to="/" replace />;
  }

  if (!params) {
    return <div className="sn-result-page"><p className="sn-loading-text">결과를 불러오는 중...</p></div>;
  }

  const success = params.status === "SUCCESS" || params.status === "success";

  return (
    <div className="sn-result-page">
      <div className={`sn-result-card ${success ? "ok" : "fail"}`}>
        <div className="sn-result-icon">
          {success ? <CheckIcon className="sn-icon-lg" /> : <XIcon className="sn-icon-lg" />}
        </div>
        <h1>{success ? "결제가 완료되었습니다" : "결제에 실패했습니다"}</h1>
        <p className="sn-result-sub">{params.message || "결과 정보를 확인해주세요."}</p>

        <div className="sn-result-table">
          <div>
            <span>주문번호</span>
            <span>{params.orderNo || params.trackId || "-"}</span>
          </div>
          <div>
            <span>거래번호(transactionId)</span>
            <span>{params.transactionId || "-"}</span>
          </div>
          <div>
            <span>승인번호</span>
            <span>{params.approvedNo || "-"}</span>
          </div>
          <div>
            <span>결제금액</span>
            <span>{params.amount ? won(Number(params.amount)) : "-"}</span>
          </div>
          <div>
            <span>거래상태</span>
            <span>{params.status || "-"}</span>
          </div>
          {params.cardName && (
            <div>
              <span>카드</span>
              <span>{params.cardName} ({params.cardNo || ""})</span>
            </div>
          )}
        </div>

        <div className="sn-result-actions">
          <button className="sn-cta" onClick={() => navigate("/")}>
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
}
