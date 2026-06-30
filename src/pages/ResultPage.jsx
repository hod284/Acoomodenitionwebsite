import { useEffect } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { CheckIcon, XIcon } from "../components/icons/index.jsx";
import { won } from "../utils/format.js";

export default function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  // 결제 결과를 F12 콘솔에도 자동으로 출력 — 화면을 안 보고도 개발자가 바로 확인 가능
  useEffect(() => {
    if (!state) return;
    const { status, data, trackId, errorMessage } = state;
    const responseReceived = data !== null && data !== undefined;

    console.groupCollapsed(
      `%c[STAYNEST 결제 결과] ${status === "success" ? "✅ 성공" : "❌ 실패"} — trackId: ${trackId}`,
      `color: ${status === "success" ? "#2f8a5e" : "#c4392b"}; font-weight: bold;`
    );
    console.log("주문번호(trackId):", trackId);
    console.log("MTouch 응답 수신 여부:", responseReceived ? "수신함" : "수신 못함");
    if (errorMessage) {
      console.error("에러 코드:", errorMessage);
    }
    if (responseReceived) {
      console.log("응답코드(resultCd):", data.result?.resultCd ?? "(없음)");
      console.log("거래번호(trxId):", data.pay?.trxId ?? "(없음)");
      console.log("승인번호(authCd):", data.pay?.authCd ?? "(없음)");
      console.log("전체 응답 객체:", data);
    } else {
      console.warn("MTouch로부터 응답 자체를 받지 못했습니다. 결제 모듈 로드 실패, 결제키 미설정, 네트워크 문제 등을 의심해보세요.");
    }
    console.groupEnd();
  }, [state]);

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
    </div>
  );
}
