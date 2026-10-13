import { describe, it, expect } from "vitest";
import { simulateContiguousAllocation } from "../lib/memory/contiguous";

describe("Contiguous Memory Allocation Algorithms", () => {
  const blocks = [
    { id: "B1", size: 100 },
    { id: "B2", size: 500 },
    { id: "B3", size: 200 },
    { id: "B4", size: 300 },
    { id: "B5", size: 600 },
  ];

  const requests = [
    { id: "P1", processName: "P1", size: 212 },
    { id: "P2", processName: "P2", size: 417 },
    { id: "P3", processName: "P3", size: 112 },
    { id: "P4", processName: "P4", size: 426 },
  ];

  it("First Fit allocates to first suitable block", () => {
    const res = simulateContiguousAllocation(blocks, requests, "FIRST_FIT");
    // P1 (212) -> B2 (500), internal frag = 288
    // P2 (417) -> B5 (600), internal frag = 183
    // P3 (112) -> B3 (200), internal frag = 88
    // P4 (426) -> cannot fit in B1(100) or B4(300) -> Fails!
    const e1 = res.events[0];
    const e2 = res.events[1];
    const e3 = res.events[2];
    const e4 = res.events[3];

    expect(e1.allocatedBlockId).toBe("B2");
    expect(e1.internalFrag).toBe(288);

    expect(e2.allocatedBlockId).toBe("B5");
    expect(e2.internalFrag).toBe(183);

    expect(e3.allocatedBlockId).toBe("B3");
    expect(e3.internalFrag).toBe(88);

    expect(e4.status).toBe("FAILED");
    expect(res.successCount).toBe(3);
    expect(res.failureCount).toBe(1);
  });

  it("Best Fit allocates to smallest suitable block", () => {
    const res = simulateContiguousAllocation(blocks, requests, "BEST_FIT");
    // P1 (212) -> fits in B4 (300, frag 88), B2 (500, frag 288), B5 (600, frag 388). Best: B4!
    // P2 (417) -> fits in B2 (500, frag 83), B5 (600, frag 183). Best: B2!
    // P3 (112) -> fits in B3 (200, frag 88), B5 (600, frag 488). Best: B3!
    // P4 (426) -> fits in B5 (600, frag 174). Best: B5!
    // All 4 succeed in Best Fit!
    expect(res.events[0].allocatedBlockId).toBe("B4");
    expect(res.events[1].allocatedBlockId).toBe("B2");
    expect(res.events[2].allocatedBlockId).toBe("B3");
    expect(res.events[3].allocatedBlockId).toBe("B5");
    expect(res.successCount).toBe(4);
    expect(res.failureCount).toBe(0);
  });

  it("Worst Fit allocates to largest suitable block", () => {
    const res = simulateContiguousAllocation(blocks, requests, "WORST_FIT");
    // P1 (212) -> B5 (600)
    // P2 (417) -> B2 (500)
    // P3 (112) -> B4 (300)
    // P4 (426) -> remaining are B1(100), B3(200) -> Fails!
    expect(res.events[0].allocatedBlockId).toBe("B5");
    expect(res.events[1].allocatedBlockId).toBe("B2");
    expect(res.events[2].allocatedBlockId).toBe("B4");
    expect(res.events[3].status).toBe("FAILED");
  });
});
