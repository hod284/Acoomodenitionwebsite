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

## AWS 배포 (GitHub Actions → EC2 자동배포)

`main` 브랜치에 push되면 `.github/workflows/deploy.yml`이 자동으로
빌드 → EC2 서버로 파일 전송 → Nginx 재시작까지 실행합니다.

**워크플로우 파일에는 서버 접속 정보가 전혀 들어있지 않습니다.** 코드에
직접 키나 IP를 넣지 않고, GitHub 저장소의 **Secrets**를 통해서만 값을
주입받습니다.

### 전체 구조

```
GitHub push
   ↓
GitHub Actions가 npm run build 실행 (dist/ 생성)
   ↓
SSH/SCP로 EC2 서버에 dist/ 내용 전송
   ↓
EC2의 Nginx가 그 파일들을 손님에게 서빙
```

S3는 사용하지 않습니다. EC2 인스턴스 하나가 빌드 결과물을 직접 서빙합니다.

### 1. EC2 인스턴스 준비 (최초 1회, 수동)

- AMI: Amazon Linux 2023, 인스턴스 유형은 t3.micro 정도로 충분
- 보안 그룹 인바운드: HTTP(80) 전체 허용, SSH(22)는 본인 IP만 허용
- 인스턴스 생성 시 키 페어(.pem) 다운로드 — 이 파일 내용이 `EC2_SSH_KEY` Secret이 됩니다

서버에 접속해서 Nginx를 설치합니다.

```bash
ssh -i 키페어.pem ec2-user@EC2_퍼블릭IP

sudo dnf install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# 배포 파일이 들어갈 디렉토리 생성
mkdir -p ~/staynest/dist
```

Nginx가 그 디렉토리를 바라보도록 설정합니다.

```bash
sudo tee /etc/nginx/conf.d/staynest.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /home/ec2-user/staynest/dist;
    index index.html;

    # React Router(SPA) 대응 — 없는 경로 요청 시 index.html로
    location / {
        try_files $uri /index.html;
    }
}
EOF

sudo nginx -t
sudo systemctl reload nginx
```

### 2. 등록해야 하는 GitHub Secrets

저장소 → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret 이름 | 필수 | 설명 | 예시 |
|---|---|---|---|
| `EC2_HOST` | 필수 | EC2 퍼블릭 IP 또는 도메인 | `13.125.xx.xx` |
| `EC2_USER` | 필수 | 접속 계정명 | `ec2-user` |
| `EC2_SSH_KEY` | 필수 | .pem 키 파일의 전체 내용 (그대로 복사) | `-----BEGIN RSA...` |
| `EC2_DEPLOY_PATH` | 필수 | 빌드 파일을 둘 서버 경로 | `/home/ec2-user/staynest/dist` |

`EC2_SSH_KEY`는 다운로드한 `.pem` 파일을 텍스트 에디터로 열어서, 내용
전체(`-----BEGIN ... PRIVATE KEY-----`부터 `-----END...-----`까지)를
그대로 복사해 붙여넣으면 됩니다.

이 4개 값만 채워주면 코드 수정 없이 바로 자동배포가 동작합니다.

### React Router(SPA) 설정 주의사항

이 프로젝트는 `/stays/:id`, `/cart`, `/payment` 같은 실제 URL 경로를
사용하는 SPA입니다. 위 Nginx 설정의 `try_files $uri /index.html;`이
바로 이 문제(새로고침 시 404)를 막아주는 부분입니다. 직접 설정하실 때
빠뜨리지 않도록 주의하세요.

### 수동 배포(참고용)

GitHub Actions 없이 로컬에서 직접 배포하려면:

```bash
npm run build
scp -i 키페어.pem -r dist/* ec2-user@EC2_IP:/home/ec2-user/staynest/dist/
ssh -i 키페어.pem ec2-user@EC2_IP "sudo systemctl reload nginx"
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
