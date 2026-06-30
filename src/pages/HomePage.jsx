import { useEffect, useState } from "react";
import * as staysService from "../services/stays.service.js";
import { PinIcon } from "../components/icons/index.jsx";
import StayCard from "../components/StayCard.jsx";

export default function HomePage() {
  const [stays, setStays] = useState(null);
  const [error, setError] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [searchTerm, setSearchTerm] = useState(""); // 실제로 필터링에 적용된 검색어

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

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(keyword.trim());
  };

  const visibleStays = stays
    ? searchTerm
      ? stays.filter((s) => {
          const term = searchTerm.toLowerCase();
          return s.name.toLowerCase().includes(term) || s.region.toLowerCase().includes(term);
        })
      : stays
    : null;

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
          <form className="sn-search" onSubmit={handleSearch}>
            <div className="sn-search-field">
              <PinIcon className="sn-icon-sm" />
              <input
                placeholder="지역, 숙소명으로 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <button type="submit" className="sn-search-btn">
              검색
            </button>
          </form>
        </div>
      </section>

      <section className="sn-section">
        <div className="sn-section-head">
          <h2>{searchTerm ? `'${searchTerm}' 검색 결과` : "지금 인기 있는 숙소"}</h2>
          <p>
            {searchTerm
              ? `${visibleStays ? visibleStays.length : 0}개의 숙소를 찾았어요`
              : "STAYNEST 게스트들이 가장 많이 머무른 공간"}
          </p>
          {searchTerm && (
            <button
              className="sn-search-clear"
              onClick={() => {
                setSearchTerm("");
                setKeyword("");
              }}
            >
              전체 보기로 돌아가기
            </button>
          )}
        </div>

        {error && <p className="sn-error">{error}</p>}
        {!stays && !error && <p className="sn-loading-text">숙소 정보를 불러오는 중...</p>}

        {visibleStays && visibleStays.length === 0 && (
          <p className="sn-loading-text">검색 결과가 없어요. 다른 지역이나 숙소명으로 검색해보세요.</p>
        )}

        {visibleStays && visibleStays.length > 0 && (
          <div className="sn-grid">
            {visibleStays.map((s) => (
              <StayCard key={s.id} stay={s} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
