import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { CartIcon, UserIcon } from "./icons/index.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartCount } = useCart();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sn-header">
      <div className="sn-header-inner">
        <Link to="/" className="sn-logo">
          <span className="sn-logo-mark">尺</span>
          <span className="sn-logo-text">
            STAY<em>NEST</em>
          </span>
        </Link>

        <nav className="sn-nav">
          <NavLink to="/" end className={({ isActive }) => `sn-navlink ${isActive ? "active" : ""}`}>
            숙소 둘러보기
          </NavLink>
          <NavLink to="/events" className={({ isActive }) => `sn-navlink ${isActive ? "active" : ""}`}>
            이벤트
          </NavLink>
        </nav>

        <div className="sn-header-actions">
          <Link to="/cart" className="sn-iconbtn" aria-label="장바구니">
            <CartIcon className="sn-icon" />
            {cartCount > 0 && <span className="sn-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="sn-user-chip">
              <span className="sn-user-dot" />
              <span>{user.name}님</span>
              <button className="sn-link-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <Link to="/login" className="sn-loginbtn">
              <UserIcon className="sn-icon-sm" />
              <span>로그인</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
