import { CONFIG } from "../config.js";

/**
 * MTouch(케이원피에스) 온라인인증결제 연동.
 * "온라인인증결제 API 연동가이드" 4장(JAVASCRIPT INTEGRATION) 기준으로 작성.
 * 이 파일은 데모가 아니라 실제로 동작하는 연동 코드입니다.
 * (CONFIG.PUBLIC_KEY를 발급받은 실키로 교체하면 운영에 바로 사용 가능)
 */

let scriptLoadingPromise = null;

/**
 * 온라인 결제키가 설정되어 있는지 여부.
 * 키가 비어있으면 결제 페이지에서 경고를 표시하고 KWON.pay() 호출을 막는 데 사용합니다.
 */
export function isPublicKeyConfigured() {
  return Boolean(CONFIG.PUBLIC_KEY && CONFIG.PUBLIC_KEY.trim().length > 0);
}

/**
 * clientsideV2.js 스크립트 로드. 1회만 로드되고 이후엔 캐시된 Promise를 재사용합니다.
 * @returns {Promise<"ready"|"failed">}
 */
export function loadMtouchScript() {
  if (typeof window !== "undefined" && window.KWON) {
    return Promise.resolve("ready");
  }
  if (scriptLoadingPromise) return scriptLoadingPromise;

  scriptLoadingPromise = new Promise((resolve) => {
    const existing = document.querySelector(`script[src="${CONFIG.MTOUCH_SCRIPT_URL}"]`);
    const onReady = () => {
      window.KWON?.debug?.(true); // 운영 적용 시 제거 권장 (디버그 텍스트 노출)
      resolve("ready");
    };
    if (existing) {
      existing.addEventListener("load", onReady);
      existing.addEventListener("error", () => resolve("failed"));
      return;
    }
    const script = document.createElement("script");
    script.src = CONFIG.MTOUCH_SCRIPT_URL;
    script.async = true;
    const timeout = setTimeout(() => resolve("failed"), 4000);
    script.onload = () => {
      clearTimeout(timeout);
      onReady();
    };
    script.onerror = () => {
      clearTimeout(timeout);
      resolve("failed");
    };
    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
}

/**
 * KWON.pay() 호출. 연동가이드 4.2 Pay Request Object 규격을 그대로 따릅니다.
 *
 * @param {object} params
 * @param {number} params.amount        총 결제금액
 * @param {Array}  params.products      상품정보 [{name, price, qty, desc}]
 * @param {string} params.trackId       가맹점 주문번호 (Unique)
 * @param {string} params.payerName     구매자 성명
 * @param {string} params.payerEmail    구매자 이메일
 * @param {string} params.payerTel      구매자 연락처
 * @param {string} [params.udf1]        가맹점 정의 필드
 * @param {"loading"|"ready"|"failed"} params.scriptStatus
 * @returns {Promise<object>} MTouch 응답 객체 (result, pay)
 */
export function payWithMtouch({ amount, products, trackId, payerName, payerEmail, payerTel, udf1, scriptStatus }) {
  if (!isPublicKeyConfigured()) {
    return Promise.reject(new Error("PUBLIC_KEY_NOT_CONFIGURED"));
  }

  // 결제 모듈이 준비되지 않았다면(스크립트 로드 실패 등) 절대로 가짜 성공을 만들지 않고
  // 명확한 실패로 처리합니다. 키가 있어도 모듈이 없으면 결제는 진행될 수 없습니다.
  if (scriptStatus !== "ready" || !window.KWON || typeof window.KWON.pay !== "function") {
    return Promise.reject(new Error("PAYMENT_MODULE_NOT_READY"));
  }

  return new Promise((resolve, reject) => {
    const payload = {
      payRoute: "3d", // 온라인인증은 '3d' 고정
      amount,
      fillerAmt: 0, // 복합과세 계약 가맹점만 사용
      publicKey: CONFIG.PUBLIC_KEY,
      products,
      responseFunction: (data) => resolve(data),
      redirectUrl: CONFIG.REDIRECT_URL,
      webhookUrl: CONFIG.WEBHOOK_URL,
      udf1: udf1 || "",
      udf2: "",
      trackId,
      payerName,
      payerEmail,
      payerTel,
    };

    try {
      window.KWON.pay(payload);
    } catch (err) {
      reject(err);
    }
  });
}
