const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// 메모리 저장소 — 새로고침하면 초기화됩니다.
// 실서비스에서는 이 배열이 실제 orders 테이블이 됩니다.
let ORDERS_TABLE = [];

/**
 * 결제 시도 전, 주문을 PENDING 상태로 먼저 생성합니다.
 * (결제 게이트웨이 호출 전에 주문을 먼저 기록해두는 것이 일반적인 패턴입니다.)
 * 나중에: POST `${CONFIG.API_BASE_URL}/api/orders`
 */
export async function createPendingOrder({ userId, cartItems, trackId, totalAmount }) {
  await delay(150);
  const order = {
    trackId,
    userId,
    items: cartItems.map((c) => ({ stayId: c.stay.id, roomId: c.room.id, price: c.room.price })),
    totalAmount,
    status: "PENDING",
    createdAt: new Date().toISOString(),
  };
  ORDERS_TABLE.push(order);
  return order;
}

/**
 * MTouch responseFunction 결과를 받아 주문 상태를 확정합니다.
 * 나중에: PATCH `${CONFIG.API_BASE_URL}/api/orders/:trackId`
 */
export async function confirmOrder(trackId, mtouchResponse) {
  await delay(150);
  const order = ORDERS_TABLE.find((o) => o.trackId === trackId);
  if (!order) {
    const err = new Error("ORDER_NOT_FOUND");
    err.code = "ORDER_NOT_FOUND";
    throw err;
  }
  const success = mtouchResponse?.result?.resultCd === "0000";
  order.status = success ? "PAID" : "FAILED";
  order.mtouchTrxId = mtouchResponse?.pay?.trxId || null;
  order.mtouchAuthCd = mtouchResponse?.pay?.authCd || null;
  order.confirmedAt = new Date().toISOString();
  return order;
}

export async function listOrdersByUser(userId) {
  await delay(100);
  return ORDERS_TABLE.filter((o) => o.userId === userId);
}
