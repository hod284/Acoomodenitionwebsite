// =========================================================================
// 더미 데이터 저장소
// -------------------------------------------------------------------------
// 이 파일의 배열들은 나중에 실제 DB 테이블이 됩니다.
//   STAYS_TABLE     ≈ stays / rooms 테이블
//   ACCOUNTS_TABLE  ≈ users 테이블
// 데이터를 "어떻게 가져오는지"는 services/ 폴더에서만 알고 있고,
// 컴포넌트/페이지는 이 파일을 직접 import하지 않습니다.
// =========================================================================

const img = (seed, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const STAYS_TABLE = [
  {
    id: "st-01",
    name: "라포레 한남 스위트",
    region: "서울 용산",
    tag: "시티뷰 · 스위트",
    rating: 4.8,
    reviewCount: 312,
    price: 189000,
    cover: img("hannam-suite", 900, 650),
    gallery: [img("hannam-1", 1200, 800), img("hannam-2", 1200, 800), img("hannam-3", 1200, 800), img("hannam-4", 1200, 800)],
    desc: "한강이 내려다보이는 통창과 프라이빗 라운지를 갖춘 시티 스위트. 체크인부터 조식까지 호텔리어 컨시어지가 함께합니다.",
    amenities: ["한강뷰", "스파시설", "무료 발렛", "조식 포함", "워크인 클로젯"],
    rooms: [
      { id: "rm-01a", name: "리버뷰 디럭스", capacity: "2인", price: 189000 },
      { id: "rm-01b", name: "스카이 스위트", capacity: "2~4인", price: 268000 },
    ],
    reviews: [
      { name: "은*경", rating: 5, text: "야경이 정말 압도적이에요. 침구 컨디션도 최상." },
      { name: "민*우", rating: 5, text: "조식이 기대 이상이었고 직원분들도 친절했습니다." },
      { name: "지*아", rating: 4, text: "위치가 좋아서 이동이 편했어요. 방음은 보통." },
    ],
  },
  {
    id: "st-02",
    name: "오롯 제주 풀빌라",
    region: "제주 애월",
    tag: "독채 · 프라이빗 풀",
    rating: 4.9,
    reviewCount: 587,
    price: 312000,
    cover: img("jeju-pool", 900, 650),
    gallery: [img("jeju-1", 1200, 800), img("jeju-2", 1200, 800), img("jeju-3", 1200, 800), img("jeju-4", 1200, 800)],
    desc: "애월 해안도로 인근 독채형 풀빌라. 사계절 온수 풀과 프라이빗 바비큐 데크로 완전한 휴식을 제공합니다.",
    amenities: ["프라이빗 풀(온수)", "바비큐 데크", "오션뷰", "무료 주차", "반려동물 동반 가능"],
    rooms: [
      { id: "rm-02a", name: "풀빌라 A동", capacity: "4인", price: 312000 },
      { id: "rm-02b", name: "풀빌라 B동 (2층)", capacity: "6인", price: 398000 },
    ],
    reviews: [
      { name: "현*수", rating: 5, text: "풀 온도가 딱 좋고 사장님이 친절하게 안내해주셨어요." },
      { name: "소*민", rating: 5, text: "사진보다 실물이 더 좋아요. 다음에 또 갈 예정." },
    ],
  },
  {
    id: "st-03",
    name: "온더그린 양양 서프하우스",
    region: "강원 양양",
    tag: "서프 · 루프탑",
    rating: 4.6,
    reviewCount: 201,
    price: 96000,
    cover: img("yangyang-surf", 900, 650),
    gallery: [img("yy-1", 1200, 800), img("yy-2", 1200, 800), img("yy-3", 1200, 800)],
    desc: "서핑 포인트 도보 3분, 루프탑에서 일몰을 즐길 수 있는 캐주얼 게스트하우스.",
    amenities: ["루프탑", "서핑보드 보관함", "공용 라운지", "무료 와이파이"],
    rooms: [
      { id: "rm-03a", name: "트윈룸", capacity: "2인", price: 96000 },
      { id: "rm-03b", name: "도미토리(4인실)", capacity: "1인 기준", price: 38000 },
    ],
    reviews: [
      { name: "재*훈", rating: 4, text: "위치 최고, 시설은 깔끔하고 가격대비 만족." },
      { name: "다*나", rating: 5, text: "루프탑 일몰 보면서 맥주 한잔, 잊지 못할 추억." },
    ],
  },
  {
    id: "st-04",
    name: "소요 경주 한옥스테이",
    region: "경북 경주",
    tag: "한옥 · 정원",
    rating: 4.7,
    reviewCount: 144,
    price: 152000,
    cover: img("gyeongju-hanok", 900, 650),
    gallery: [img("gj-1", 1200, 800), img("gj-2", 1200, 800), img("gj-3", 1200, 800)],
    desc: "고즈넉한 한옥 마당과 다실을 갖춘 프라이빗 한옥스테이. 전통 조식 상이 함께 제공됩니다.",
    amenities: ["전통 조식", "프라이빗 마당", "다실", "무료 주차"],
    rooms: [
      { id: "rm-04a", name: "별채 1호", capacity: "2인", price: 152000 },
      { id: "rm-04b", name: "본채 대청실", capacity: "4인", price: 219000 },
    ],
    reviews: [{ name: "유*진", rating: 5, text: "마당에서 마시는 아침 차 한잔이 힐링이었어요." }],
  },
  {
    id: "st-05",
    name: "포레스트 가평 글램핑",
    region: "경기 가평",
    tag: "글램핑 · 자연",
    rating: 4.5,
    reviewCount: 268,
    price: 118000,
    cover: img("gapyeong-glamp", 900, 650),
    gallery: [img("gp-1", 1200, 800), img("gp-2", 1200, 800), img("gp-3", 1200, 800)],
    desc: "북한강을 따라 펼쳐진 숲속 글램핑존. 개별 화로대와 온수 샤워시설이 마련되어 있습니다.",
    amenities: ["개별 화로대", "강뷰", "온수 샤워", "조식 키트 제공"],
    rooms: [
      { id: "rm-05a", name: "리버뷰 텐트", capacity: "4인", price: 118000 },
      { id: "rm-05b", name: "디럭스 텐트", capacity: "2인", price: 99000 },
    ],
    reviews: [{ name: "태*환", rating: 4, text: "아이들과 가기 좋았어요. 화로대 체험이 인기였습니다." }],
  },
  {
    id: "st-06",
    name: "마레 부산 마린 스위트",
    region: "부산 해운대",
    tag: "오션뷰 · 호텔",
    rating: 4.8,
    reviewCount: 433,
    price: 224000,
    cover: img("busan-marine", 900, 650),
    gallery: [img("bs-1", 1200, 800), img("bs-2", 1200, 800), img("bs-3", 1200, 800), img("bs-4", 1200, 800)],
    desc: "해운대 해변 정면에 위치한 마린 스위트. 전객실 오션뷰와 인피니티 풀을 운영합니다.",
    amenities: ["오션뷰", "인피니티 풀", "피트니스", "조식 포함"],
    rooms: [
      { id: "rm-06a", name: "오션뷰 디럭스", capacity: "2인", price: 224000 },
      { id: "rm-06b", name: "마린 스위트", capacity: "2~3인", price: 312000 },
    ],
    reviews: [{ name: "하*은", rating: 5, text: "창문 열면 바로 바다, 인피니티 풀도 최고였어요." }],
  },
];

export const ACCOUNTS_TABLE = Array.from({ length: 10 }, (_, i) => {
  const n = String(i + 1).padStart(2, "0");
  return { id: `user${n}`, pw: `pass${n}!`, name: `테스트회원${n}` };
});

export const EVENTS_TABLE = [
  {
    id: "ev-01",
    title: "여름 휴가 미리 예약, 최대 30% 할인",
    period: "2026.07.01 ~ 2026.08.31",
    badge: "할인",
    banner: img("event-summer", 1200, 500),
    summary: "7~8월 투숙 예약 시 객실 요금 최대 30% 즉시 할인",
    body: "여름 성수기 숙소를 미리 예약하면 객실 요금을 최대 30%까지 즉시 할인받을 수 있습니다. 결제 시 별도 코드 입력 없이 자동으로 할인된 금액이 적용됩니다. (데모 화면이며 실제 결제 금액에는 반영되지 않습니다.)",
  },
  {
    id: "ev-02",
    title: "첫 예약 고객 5,000원 즉시 적립",
    period: "상시 진행",
    badge: "신규",
    banner: img("event-welcome", 1200, 500),
    summary: "STAYNEST에서 처음 예약하는 회원에게 적립금 5,000원 지급",
    body: "회원가입 후 첫 예약을 완료하면 적립금 5,000원이 자동으로 지급됩니다. 적립금은 다음 결제 시 현금처럼 사용할 수 있습니다. (데모 화면이며 실제 적립/사용 기능은 동작하지 않습니다.)",
  },
  {
    id: "ev-03",
    title: "리뷰 작성하고 사진 인증하면 커피 쿠폰",
    period: "2026.06.01 ~ 2026.12.31",
    badge: "이벤트",
    banner: img("event-review", 1200, 500),
    summary: "숙소 이용 후 사진과 함께 리뷰를 남기면 커피 쿠폰 증정",
    body: "투숙 후 사진을 첨부한 리뷰를 작성하면 추첨을 통해 커피 쿠폰을 드립니다. 매월 1일 당첨자를 발표합니다. (데모 화면이며 실제 응모/추첨 기능은 동작하지 않습니다.)",
  },
];
