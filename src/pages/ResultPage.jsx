import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckIcon, XIcon } from "../components/icons/index.jsx";
import { won } from "../utils/format.js";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // 결제 페이지를 거치지 않고 직접 /payment/result로 들어온 경우 보호
  if (!state) return <Navigate to="/" replace />;

  const { status, data, total, trackId } = state;
  const success = status === "success";
  const result = data?.result || {};
  const pay = data?.pay || {};

  return (
    <div className="sn-result-page">
      <div className={`sn-result-card ${success ? "ok" : "fail"}`}>
        <div className="sn-result-icon">{success ? <CheckIcon className="sn-icon-lg" /> : <XIcon className="sn-icon-lg" />}</div>
        <h1>{success ? "결제가 완료되었습니다" : "결제에 실패했습니다"}</h1>
        <p className="sn-result-sub">{result.advanceMsg || result.resultMsg || "결과 정보를 확인해주세요."}</p>

        <div className="sn-result-table">
          <div>
            <span>주문번호</span>
            <span>{trackId}</span>
          </div>
          <div>
            <span>거래번호(trxId)</span>
            <span>{pay.trxId || "-"}</span>
          </div>
          <div>
            <span>승인번호</span>
            <span>{pay.authCd || "-"}</span>
          </div>
          <div>
            <span>결제금액</span>
            <span>{won(total || 0)}</span>
          </div>
          <div>
            <span>응답코드</span>
            <span>{result.resultCd || "-"}</span>
          </div>
        </div>

        <div className="sn-result-actions">
          <button className="sn-cta" onClick={() => navigate("/")}>
            홈으로
          </button>
        </div>
      </div>

      <details className="sn-raw">
        <summary>API 응답 원본 (개발자 확인용)</summary>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </details>
    </div>
  );
}
