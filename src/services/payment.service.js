import { CONFIG } from "../config.js";

/**
 * 케이원피에스 1차 PG 카드결제 연동
 * "케이원피에스_1차PG인증_결제_연동가이드" 기준으로 구현
 *
 * 결제 방식: HTML form을 동적으로 생성해서
 *            https://devpay.kwonps.com/card/payment 로 POST submit
 *            → 결제창이 팝업(PC) 또는 현재 창(모바일)으로 호출됨
 *
 * ⚠️ requestHash는 원래 서버에서 계산해야 합니다.
 *    licenseKey가 브라우저에 노출되기 때문입니다.
 *    현재는 테스트 목적으로만 클라이언트에서 계산합니다.
 */

// SHA256 해시 계산 (Web Crypto API 사용 - 브라우저 내장)
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// 오늘 날짜를 yyyymmdd 형식으로 반환
function getTodayString() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

/**
 * 결제창 호출
 * @param {object} params
 * @param {string} params.orderNo    - 가맹점 주문번호 (unique)
 * @param {number} params.amount     - 결제금액
 * @param {string} params.product    - 상품명
 * @param {string} params.userName   - 고객명
 * @param {string} params.userId     - 고객아이디
 * @param {string} params.userEmail  - 고객이메일 (선택)
 * @param {string} params.payCompleteUrl - 결제완료 후 이동 URL (필수)
 * @param {string} params.payCancelUrl   - 결제취소 후 이동 URL (필수)
 * @param {string} params.notiUrl    - 노티 수신 URL (선택)
 */
export async function payWithKwon({
  orderNo,
  amount,
  product,
  userName,
  userId,
  userEmail,
  payCompleteUrl,
  payCancelUrl,
  notiUrl,
}) {
  const today = getTodayString();

  // requestHash 계산: 결제일자 + merchantId + orderNo + amount + licenseKey
  const hashSource = `${today}${CONFIG.MERCHANT_ID}${orderNo}${amount}${CONFIG.LICENSE_KEY}`;
  const requestHash = await sha256(hashSource);

  // HTML form을 동적 생성해서 POST submit — 이것이 이 API의 결제창 호출 방식
  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${CONFIG.PAY_BASE_URL}/card/payment`;

  // PC 환경: 팝업(window.open), 모바일: self (가이드 3.3.1 주의사항 참고)
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) {
    form.target = "_self";
  } else {
    const popup = window.open("", "kwon_payment", "width=500,height=700");
    if (!popup) {
      throw new Error("POPUP_BLOCKED");
    }
    form.target = "kwon_payment";
  }

  const fields = {
    merchantId: CONFIG.MERCHANT_ID,
    payMethod: "CARD",
    orderNo,
    amount,
    taxFreeAmount: 0,
    product,
    userName,
    userId,
    userEmail: userEmail || "",
    notiUrl: notiUrl || "",
    payCompleteUrl,
    payCancelUrl,
    requestHash,
  };

  Object.entries(fields).forEach(([key, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
