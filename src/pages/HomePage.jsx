import { useEffect, useState } from "react";
import * as staysService from "../services/stays.service.js";
import { PinIcon } from "../components/icons/index.jsx";
import StayCard from "../components/StayCard.jsx";

export default function HomePage() {
  const [stays, setStays] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    staysService
      .fetchStays()
      .then((data) => {
        if (alive) setStays(data);
      })
      .catch(() => {
        if (alive) setError("숙소 목록을 불러오지 못했어요.");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <section className="sn-hero">
        <img src="https://picsum.photos/seed/hero-main/1600/900" alt="" className="sn-hero-img" />
        <div className="sn-hero-overlay" />
        <div className="sn-hero-content">
          <p className="sn-hero-eyebrow">이번 주말, 어디로든</p>
          <h1 className="sn-hero-title">
            머무는 순간이
            <br />
            여행이 되는 곳
          </h1>
          <div className="sn-search">
            <div className="sn-search-field">
              <PinIcon className="sn-icon-sm" />
              <input placeholder="지역, 숙소명으로 검색" />
            </div>
            <button className="sn-search-btn">검색</button>
          </div>
        </div>
      </section>

      <section className="sn-section">
        <div className="sn-section-head">
          <h2>지금 인기 있는 숙소</h2>
          <p>STAYNEST 게스트들이 가장 많이 머무른 공간</p>
        </div>

        {error && <p className="sn-error">{error}</p>}
        {!stays && !error && <p className="sn-loading-text">숙소 정보를 불러오는 중...</p>}

        {stays && (
          <div className="sn-grid">
            {stays.map((s) => (
              <StayCard key={s.id} stay={s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
