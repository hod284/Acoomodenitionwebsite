import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as staysService from "../services/stays.service.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { BackIcon, PinIcon, StarIcon, CheckIcon } from "../components/icons/index.jsx";
import { won } from "../utils/format.js";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const [stay, setStay] = useState(null);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(null);

  useEffect(() => {
    let alive = true;
    setStay(null);
    setError(null);
    staysService
      .fetchStayById(id)
      .then((data) => {
        if (alive) setStay(data);
      })
      .catch(() => {
        if (alive) setError("숙소 정보를 찾을 수 없어요.");
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="sn-detail">
        <p className="sn-error">{error}</p>
        <Link to="/" className="sn-cta">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }
  if (!stay) {
    return (
      <div className="sn-detail">
        <p className="sn-loading-text">불러오는 중...</p>
      </div>
    );
  }

  const handleAdd = (room) => {
    if (!user) {
      navigate("/login", { state: { from: `/stays/${id}` } });
      return;
    }
    addToCart(stay, room);
    setAdded(room.id);
    setTimeout(() => setAdded(null), 1600);
  };

  return (
    <div className="sn-detail">
      <button className="sn-backbtn" onClick={() => navigate("/")}>
        <BackIcon className="sn-icon-sm" />
        목록으로
      </button>

      <div className="sn-gallery">
        <img src={stay.gallery[0]} className="sn-gallery-main" alt={stay.name} />
        <div className="sn-gallery-sub">
          {stay.gallery.slice(1, 4).map((g, i) => (
            <img key={i} src={g} alt="" />
          ))}
        </div>
      </div>

      <div className="sn-detail-grid">
        <div className="sn-detail-main">
          <p className="sn-detail-region">
            <PinIcon className="sn-icon-sm" />
            {stay.region}
          </p>
          <h1>{stay.name}</h1>
          <div className="sn-detail-rating">
            <StarIcon className="sn-star" />
            <strong>{stay.rating}</strong>
            <span>후기 {stay.reviewCount}건</span>
          </div>
          <p className="sn-detail-desc">{stay.desc}</p>

          <div className="sn-amenities">
            {stay.amenities.map((a) => (
              <span key={a} className="sn-amenity">
                <CheckIcon className="sn-icon-xs" />
                {a}
              </span>
            ))}
          </div>

          <hr className="sn-divider" />

          <h2 className="sn-subhead">게스트 후기</h2>
          <div className="sn-reviews">
            {stay.reviews.map((r, i) => (
              <div key={i} className="sn-review">
                <div className="sn-review-top">
                  <span className="sn-review-name">{r.name}</span>
                  <span className="sn-review-stars">
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </span>
                </div>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="sn-room-panel">
          <h2 className="sn-subhead">객실 선택</h2>
          {stay.rooms.map((room) => (
            <div key={room.id} className="sn-room-card">
              <div>
                <p className="sn-room-name">{room.name}</p>
                <p className="sn-room-cap">{room.capacity} 기준</p>
                <p className="sn-room-price">
                  {won(room.price)} <span>/ 1박</span>
                </p>
              </div>
              <button className={`sn-room-btn ${added === room.id ? "added" : ""}`} onClick={() => handleAdd(room)}>
                {added === room.id ? (
                  <>
                    <CheckIcon className="sn-icon-xs" />
                    담음
                  </>
                ) : (
                  "담기"
                )}
              </button>
            </div>
          ))}
          <button className="sn-cart-go" onClick={() => navigate("/cart")}>
            장바구니 보기
          </button>
        </aside>
      </div>
    </div>
  );
}
