import { describe, it, expect } from "vitest";
import { simulateFIFO, simulateLRU, simulateOptimal } from "../lib/memory/pageReplacement";

describe("Page Replacement Algorithms", () => {
  // Galvin benchmark: 20 references with 3 frames
  const galvinRefs = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1];
  const frames = 3;

  it("FIFO matches textbook fault count (15 faults)", () => {
    const res = simulateFIFO(galvinRefs, frames);
    expect(res.totalFaults).toBe(15);
    expect(res.totalHits).toBe(5);
    expect(res.hitRatio).toBe(25);
    expect(res.faultRatio).toBe(75);
    expect(res.steps.length).toBe(20);
  });

  it("LRU matches textbook fault count (12 faults)", () => {
    const res = simulateLRU(galvinRefs, frames);
    expect(res.totalFaults).toBe(12);
    expect(res.totalHits).toBe(8);
    expect(res.hitRatio).toBe(40);
    expect(res.faultRatio).toBe(60);
    expect(res.steps.length).toBe(20);
  });

  it("Optimal matches textbook fault count (9 faults)", () => {
    const res = simulateOptimal(galvinRefs, frames);
    expect(res.totalFaults).toBe(9);
    expect(res.totalHits).toBe(11);
    expect(res.hitRatio).toBe(55);
    expect(res.faultRatio).toBe(45);
    expect(res.steps.length).toBe(20);
  });

  it("Handles all-hit and all-fault boundary strings", () => {
    const repeated = [1, 1, 1, 1];
    const res = simulateFIFO(repeated, 2);
    expect(res.totalFaults).toBe(1);
    expect(res.totalHits).toBe(3);
  });
});
