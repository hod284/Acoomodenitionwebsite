import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import * as eventsService from "../services/events.service.js";
import { BackIcon } from "../components/icons/index.jsx";

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    setEvent(null);
    setError(null);
    eventsService
      .fetchEventById(id)
      .then((data) => {
        if (alive) setEvent(data);
      })
      .catch(() => {
        if (alive) setError("이벤트 정보를 찾을 수 없어요.");
      });
    return () => {
      alive = false;
    };
  }, [id]);

  if (error) {
    return (
      <div className="sn-event-detail">
        <p className="sn-error">{error}</p>
        <Link to="/events" className="sn-cta">
          이벤트 목록으로
        </Link>
      </div>
    );
  }
  if (!event) {
    return (
      <div className="sn-event-detail">
        <p className="sn-loading-text">불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="sn-event-detail">
      <button className="sn-backbtn" onClick={() => navigate("/events")}>
        <BackIcon className="sn-icon-sm" />
        이벤트 목록으로
      </button>

      <img src={event.banner} alt={event.title} className="sn-event-detail-banner" />

      <span className="sn-event-badge">{event.badge}</span>
      <h1>{event.title}</h1>
      <p className="sn-event-detail-period">{event.period}</p>
      <p className="sn-event-detail-body">{event.body}</p>

      <div className="sn-result-actions">
        <button className="sn-cta" onClick={() => navigate("/")}>
          숙소 둘러보기
        </button>
      </div>
    </div>
  );
}
