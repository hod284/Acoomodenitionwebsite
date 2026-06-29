import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import * as authService from "../services/auth.service.js";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [demoAccounts, setDemoAccounts] = useState([]);

  const from = location.state?.from || "/";

  useEffect(() => {
    authService.listDemoAccounts().then(setDemoAccounts);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(id, pw);
      navigate(from, { replace: true });
    } catch (err) {
      setError("아이디 또는 비밀번호가 일치하지 않아요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sn-login-page">
      <form className="sn-login-card" onSubmit={submit}>
        <span className="sn-logo-mark sn-logo-mark-lg">尺</span>
        <h1>로그인</h1>
        <p className="sn-login-sub">예약 및 결제를 위해 로그인해주세요.</p>

        <label className="sn-field">
          <span>아이디</span>
          <input value={id} onChange={(e) => setId(e.target.value)} placeholder="user01" autoComplete="off" />
        </label>
        <label className="sn-field">
          <span>비밀번호</span>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="pass01!" />
        </label>

        {error && <p className="sn-error">{error}</p>}

        <button type="submit" className="sn-cta sn-cta-block" disabled={loading}>
          {loading ? "확인 중..." : "로그인"}
        </button>

        <button type="button" className="sn-hint-toggle" onClick={() => setShowHint((v) => !v)}>
          {showHint ? "테스트 계정 숨기기" : "테스트 계정 보기 (10개)"}
        </button>

        {showHint && (
          <div className="sn-hint-box">
            {demoAccounts.map((a) => (
              <button
                type="button"
                key={a.id}
                className="sn-hint-row"
                onClick={() => {
                  setId(a.id);
                  setPw(a.pw);
                }}
              >
                <span>{a.id}</span>
                <span>{a.pw}</span>
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
