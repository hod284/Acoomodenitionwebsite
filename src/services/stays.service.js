import { STAYS_TABLE } from "../data/dummyData.js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 나중에 백엔드가 생기면 이 두 함수의 본문만 fetch()로 교체하면 됩니다.
// 호출하는 쪽(페이지/컴포넌트)은 한 글자도 바꿀 필요가 없습니다.

export async function fetchStays() {
  // 나중에: return (await fetch(`${CONFIG.API_BASE_URL}/api/stays`)).json();
  await delay(250);
  return STAYS_TABLE;
}

export async function fetchStayById(id) {
  // 나중에: return (await fetch(`${CONFIG.API_BASE_URL}/api/stays/${id}`)).json();
  await delay(150);
  const stay = STAYS_TABLE.find((s) => s.id === id);
  if (!stay) {
    const err = new Error("STAY_NOT_FOUND");
    err.code = "STAY_NOT_FOUND";
    throw err;
  }
  return stay;
}
