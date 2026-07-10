const request = require("supertest");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

const api = request(BASE_URL);

const playerId = 1;
const rewardId = 2;
const itemId =  3;

const headers = (key) => ({
  "Idempotency-Key": key,
  "Content-Type": "application/json",
});

describe("Wallet Service Integration Tests", () => {

  /* ---------------- CREDIT ---------------- */

  test("Credit wallet", async () => {
    const res = await api
      .post(`/v1/wallets/${playerId}/credit`)
      .set(headers("credit-1"))
      .send({
        amount: 10000,
        reason: "Battle Reward",
      });

    expect([200, 201]).toContain(res.status);
  });

  test("Credit is idempotent", async () => {
    const first = await api
      .post(`/v1/wallets/${playerId}/credit`)
      .set(headers("credit-2"))
      .send({
        amount: 500,
        reason: "Quest",
      });

    const second = await api
      .post(`/v1/wallets/${playerId}/credit`)
      .set(headers("credit-2"))
      .send({
        amount: 500,
        reason: "Quest",
      });

    expect(second.status).toBe(first.status);
    expect(second.body.transaction).toEqual(first.body.transaction);
  });

  test("Reject negative amount", async () => {
    const res = await api
      .post(`/v1/wallets/${playerId}/credit`)
      .set(headers("credit-invalid"))
      .send({
        amount: -100,
        reason: "Hack",
      });

    expect(res.status).toBe(400);
  });

  /* ---------------- PURCHASE ---------------- */

  test("Successful purchase", async () => {
    const res = await api
      .post(`/v1/wallets/${playerId}/purchase`)
      .set(headers("purchase-1"))
      .send({
        itemId,
        price: 100,
      });

    expect([200, 201]).toContain(res.status);
  });

  test("Purchase idempotency", async () => {
    const first = await api
      .post(`/v1/wallets/${playerId}/purchase`)
      .set(headers("purchase-2"))
      .send({
        itemId: 2,
        price: 50,
      });

    const second = await api
      .post(`/v1/wallets/${playerId}/purchase`)
      .set(headers("purchase-2"))
      .send({
        itemId: 2,
        price: 50,
      });

    expect(second.status).toBe(first.status);
    expect(second.body.transaction).toEqual(first.body.transaction);
  });

  test("Reject insufficient balance", async () => {
    const res = await api
      .post(`/v1/wallets/${playerId}/purchase`)
      .set(headers("purchase-expensive"))
      .send({
        itemId: 999,
        price: 999999,
      });

    expect([400, 409]).toContain(res.status);
  });

  /* ---------------- CLAIM ---------------- */

  test("Claim reward", async () => {
    const res = await api
      .post(`/v1/rewards/${rewardId}/claim`)
      .set(headers("reward-1"))
      .send({
        playerId,
      });

    expect([200, 201]).toContain(res.status);
  });

  test("Reward can only be claimed once", async () => {
    await api
      .post(`/v1/rewards/${rewardId}/claim`)
      .set(headers("reward-once"))
      .send({
        playerId,
      });

    const second = await api
      .post(`/v1/rewards/${rewardId}/claim`)
      .set(headers("reward-new-key"))
      .send({
        playerId,
      });

    expect([400, 409]).toContain(second.status);
  });

  /* ---------------- GET WALLET ---------------- */

  test("Get wallet", async () => {
    const res = await api.get(`/v1/wallets/${playerId}`);

    expect(res.status).toBe(200);

    expect(res.body).toHaveProperty("balance");
    expect(res.body).toHaveProperty("inventory");
    expect(res.body).toHaveProperty("claimedRewards");
  });

  /* ---------------- VALIDATION ---------------- */

  test("Reject missing amount", async () => {
    const res = await api
      .post(`/v1/wallets/${playerId}/credit`)
      .set(headers("missing"))
      .send({
        reason: "Battle",
      });

    expect(res.status).toBe(400);
  });

  test("Reject invalid JSON fields", async () => {
    const res = await api
      .post(`/v1/wallets/${playerId}/purchase`)
      .set(headers("bad"))
      .send({
        itemId: "abc",
        price: -5,
      });

    expect(res.status).toBe(400);
  });

  /* ---------------- CONCURRENCY ---------------- */

  test("Concurrent credits", async () => {
    const promises = [];

    for (let i = 0; i < 10; i++) {
      promises.push(
        api
          .post(`/v1/wallets/${playerId}/credit`)
          .set(headers(`con-credit-${i}`))
          .send({
            amount: 10,
            reason: "Concurrent",
          })
      );
    }

    const responses = await Promise.all(promises);

    responses.forEach((r) =>
      expect([200, 201]).toContain(r.status)
    );
  });


});