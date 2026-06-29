# STAYNEST — 숙박 예약 + MTouch 결제 연동 데모

숙박 예약 사이트 형태의 React(Vite) 프로젝트입니다.
실제 폴더/파일 구조로 분리되어 있으며, MTouch(케이원피에스) 온라인인증결제(KWON.pay) 연동이 포함되어 있습니다.

## 실행 방법

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 접속.

## 폴더 구조

```
src/
├── main.jsx                   앱 진입점 (BrowserRouter 적용)
├── App.jsx                    라우트 정의
├── config.js                  결제키 등 운영 설정값 (실연동 시 여기만 교체)
│
├── pages/                     페이지 단위 (URL과 1:1 대응)
│   ├── HomePage.jsx           "/"            메인 - 숙소 목록
│   ├── DetailPage.jsx         "/stays/:id"   상세 - 갤러리/후기/객실선택
│   ├── CartPage.jsx           "/cart"        장바구니
│   ├── LoginPage.jsx          "/login"       로그인 (더미 계정 10개)
│   ├── PaymentPage.jsx        "/payment"     결제 (KWON.pay 호출)
│   └── ResultPage.jsx         "/payment/result"  결제 결과
│
├── components/                재사용 UI 컴포넌트
│   ├── Header.jsx             전체 페이지 공통 헤더 (로그인 탭 항상 노출)
│   ├── Footer.jsx
│   ├── StayCard.jsx           숙소 카드
│   └── icons/index.jsx        인라인 SVG 아이콘 모음
│
├── context/                   전역 상태 (Context API)
│   ├── AuthContext.jsx        로그인 상태
│   └── CartContext.jsx        장바구니 상태
│
├── services/                  "API 레이어" — 데이터 입출력은 모두 여기를 통함
│   ├── stays.service.js       숙소/객실 조회
│   ├── auth.service.js        로그인/계정
│   ├── orders.service.js      주문 생성/확정
│   └── payment.service.js     MTouch 결제 연동 (실제 동작 코드)
│
├── data/
│   └── dummyData.js           더미 데이터 (나중에 실제 DB 테이블이 될 부분)
│
├── utils/
│   └── format.js              공통 유틸 (통화 포맷 등)
│
└── styles/
    └── global.css
```

## DB 연동 시 확장 방법

`services/` 폴더의 함수들은 모두 `async`이며, 컴포넌트/페이지는 이 함수들의
시그니처만 알고 내부 구현은 모릅니다. 그래서 백엔드가 준비되면 아래처럼
**함수 본문만 교체**하면 됩니다 (호출하는 쪽 코드는 수정 불필요):

```js
// services/stays.service.js (현재)
export async function fetchStays() {
  await delay(250);
  return STAYS_TABLE;
}

// services/stays.service.js (DB 연동 후)
export async function fetchStays() {
  const res = await fetch(`${CONFIG.API_BASE_URL}/api/stays`);
  return res.json();
}
```

같은 방식으로 `auth.service.js`, `orders.service.js`도 교체하면 됩니다.

## 결제(MTouch) 연동

`services/payment.service.js`는 데모용 가짜 코드가 아니라, 제공된
"온라인인증결제 API 연동가이드" 4장(JAVASCRIPT INTEGRATION) 규격을 그대로
따른 **실제 동작하는 연동 코드**입니다.

- `loadMtouchScript()` — `clientsideV2.js` 동적 로드
- `payWithMtouch()` — `KWON.pay({...})` 호출, `responseFunction`으로 결과 수신

### 운영 적용 시 체크리스트

1. `src/config.js`의 `PUBLIC_KEY`를 발급받은 실제 키(`pk_...`)로 교체
2. `REDIRECT_URL`, `WEBHOOK_URL`을 실제 서버 엔드포인트로 교체
3. `payment.service.js` 내 `KWON.debug(true)` 호출 제거 (운영 환경에서는 디버그 로그 비노출 권장)
4. 결제 성공/실패 결과를 서버에도 반드시 기록 (`orders.service.js`의
   `confirmOrder`를 실제 API 호출로 교체) — 클라이언트 응답만 믿지 말 것

### 결제 모듈이 준비되지 않은 경우

`svcapi.mtouch.com` 스크립트 로드에 실패하거나(네트워크 제한, 방화벽 등)
결제키가 비어있으면, **가짜 성공 응답을 만들지 않고 명확히 결제 실패로
처리**합니다. 키가 있어도 결제 모듈이 준비되지 않으면 결제 버튼이
비활성화되어 시도 자체가 불가능합니다. (실제 결제 없이 "성공"처럼 보이는
화면이 뜨는 일은 없습니다.)

## AWS 배포 (GitHub Actions 자동배포)

`main` 브랜치에 push되면 `.github/workflows/deploy.yml`이 자동으로
빌드 → S3 업로드 → CloudFront 캐시 무효화까지 실행합니다.

**워크플로우 파일에는 AWS 계정 정보가 전혀 들어있지 않습니다.** 코드에
직접 키를 넣지 않고, GitHub 저장소의 **Secrets**를 통해서만 값을
주입받습니다.

### 등록해야 하는 GitHub Secrets

저장소 → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`
에서 아래 항목을 등록하면 됩니다 (회사 AWS 담당자가 진행).

| Secret 이름 | 필수 | 설명 | 예시 |
|---|---|---|---|
| `AWS_ACCESS_KEY_ID` | 필수 | IAM 사용자 액세스 키 | `AKIA...` |
| `AWS_SECRET_ACCESS_KEY` | 필수 | IAM 사용자 시크릿 키 | - |
| `AWS_REGION` | 필수 | 리전 | `ap-northeast-2` |
| `S3_BUCKET_NAME` | 필수 | 배포 대상 S3 버킷명 | `staynest-prod` |
| `CLOUDFRONT_DISTRIBUTION_ID` | 선택 | CloudFront 사용 시 배포 ID | `E1A2B3C4D5` |

이 5개 값만 채워주면 코드 수정 없이 바로 자동배포가 동작합니다.
CloudFront를 안 쓴다면 `CLOUDFRONT_DISTRIBUTION_ID`는 비워두면 되고,
그 단계는 자동으로 건너뜁니다.

### IAM 권한 (최소 권한 예시)

배포에 사용하는 IAM 사용자/역할에는 아래 정도의 권한만 있으면 됩니다.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
      "Resource": [
        "arn:aws:s3:::<버킷명>",
        "arn:aws:s3:::<버킷명>/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": ["cloudfront:CreateInvalidation"],
      "Resource": "*"
    }
  ]
}
```

### React Router(SPA) 설정 주의사항

이 프로젝트는 `/stays/:id`, `/cart`, `/payment` 같은 실제 URL 경로를
사용하는 SPA입니다. S3/CloudFront에서 404를 `index.html`로 돌려주는
설정이 안 되어 있으면 새로고침 시 빈 화면이 나옵니다.

- **S3 정적 웹사이트 호스팅**: Error document를 `index.html`로 지정
- **CloudFront**: Custom Error Response에서 403/404 → `/index.html`, 응답코드 200으로 설정

### 수동 배포(참고용)

GitHub Actions 없이 로컬에서 직접 배포하려면:

```bash
npm run build
aws s3 sync dist/ s3://<버킷명> --delete
aws cloudfront create-invalidation --distribution-id <배포ID> --paths "/*"
```

## 테스트 계정 (더미, DB 없음)

`data/dummyData.js`의 `ACCOUNTS_TABLE`에 10개 계정이 들어 있습니다.
로그인 화면에서 "테스트 계정 보기"를 누르면 확인할 수 있습니다.

```
user01 / pass01!
user02 / pass02!
...
user10 / pass10!
```

## 주의사항

- 브랜드명 "STAYNEST"와 모든 숙소/사진/후기는 데모용 가상 데이터입니다.
- 사진은 picsum.photos placeholder를 사용했습니다. 실제 서비스에서는
  직접 보유한 사진으로 교체해야 합니다.
