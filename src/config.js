// 실제 운영 연동 시 이 파일의 값만 교체하면 됩니다.
export const CONFIG = {
  // 1차 PG 결제 서버 주소
  // 개발: https://devpay.kwonps.com
  // 운영: https://pay.kwonps.com
  PAY_BASE_URL: "https://pay.kwonps.com",

  // 케이원피에스에서 발급받은 가맹점 아이디
  MERCHANT_ID: "2128703111",

  // 온라인결제 KEY (License Key) — requestHash 계산용
  // ⚠️ 실서비스에서는 절대 클라이언트에 노출하면 안 됩니다.
  //    반드시 서버(백엔드)에서 requestHash를 계산해서 내려받는 방식으로 변경하세요.
  LICENSE_KEY: "5f6062459d726c9b5619fb2104ab417cdcf333e0d8732ac3a12696c906267dd4",

  // 백엔드 서버 주소 (나중에 채우기)
  API_BASE_URL: "",
};
