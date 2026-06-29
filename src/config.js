// 실제 운영 연동 시 이 파일의 값만 교체하면 됩니다.
export const CONFIG = {
  MTOUCH_SCRIPT_URL: "https://svcapi.mtouch.com/js/clientsideV2.js",

  // ⚠️ 발급받은 온라인 결제키(pk_로 시작)를 받기 전까지 공란입니다.
  // 키가 없으면 결제 페이지에서 경고가 표시되고 KWON.pay()를 호출하지 않습니다.
  PUBLIC_KEY: "",

  REDIRECT_URL: "https://www.staynest.example.com/payment/redirect",
  WEBHOOK_URL: "https://www.staynest.example.com/payment/webhook",
  // 백엔드가 생기면 채워서 services/* 에서 사용
  API_BASE_URL: "", // 예: "https://api.staynest.com"
};
