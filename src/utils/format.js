export const won = (n) => n.toLocaleString("ko-KR") + "원";

export const genTrackId = () => "STN" + Date.now() + Math.floor(Math.random() * 1000);
