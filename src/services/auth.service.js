import { ACCOUNTS_TABLE } from "../data/dummyData.js";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/**
 * 로그인.
 * 나중에:
 *   const res = await fetch(`${CONFIG.API_BASE_URL}/api/auth/login`, {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ id, pw }),
 *   });
 *   if (!res.ok) throw new Error("INVALID_CREDENTIALS");
 *   return res.json();
 */
export async function login(id, pw) {
  await delay(300);
  const found = ACCOUNTS_TABLE.find((a) => a.id === id.trim() && a.pw === pw);
  if (!found) {
    const err = new Error("INVALID_CREDENTIALS");
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }
  return { id: found.id, name: found.name };
}

export async function logout() {
  await delay(80);
  return true;
}

/**
 * 데모 전용: 로그인 화면에 테스트 계정 10개를 보여주기 위한 함수.
 * 실서비스에서는 반드시 제거해야 합니다. (비밀번호를 클라이언트로 내려주면 안 됨)
 */
export async function listDemoAccounts() {
  await delay(0);
  return ACCOUNTS_TABLE.map((a) => ({ id: a.id, pw: a.pw }));
}
