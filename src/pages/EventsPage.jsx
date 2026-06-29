import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as eventsService from "../services/events.service.js";

export default function EventsPage() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    eventsService
      .fetchEvents()
      .then((data) => {
        if (alive) setEvents(data);
      })
      .catch(() => {
        if (alive) setError("이벤트 목록을 불러오지 못했어요.");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="sn-events-page">
      <div className="sn-section-head">
        <h2>진행 중인 이벤트</h2>
        <p>STAYNEST에서 준비한 다양한 혜택을 확인해보세요</p>
      </div>

      {error && <p className="sn-error">{error}</p>}
      {!events && !error && <p className="sn-loading-text">불러오는 중...</p>}

      {events && (
        <div className="sn-event-list">
          {events.map((e) => (
            <Link key={e.id} to={`/events/${e.id}`} className="sn-event-card">
              <img src={e.banner} alt={e.title} className="sn-event-banner" />
              <div className="sn-event-card-body">
                <span className="sn-event-badge">{e.badge}</span>
                <h3>{e.title}</h3>
                <p className="sn-event-summary">{e.summary}</p>
                <p className="sn-event-period">{e.period}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
