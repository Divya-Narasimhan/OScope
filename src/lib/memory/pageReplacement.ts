import {
  PageReplacementAlgorithm,
  PageStep,
  PageReplacementResult,
} from "./types";

export function simulateFIFO(
  referenceString: number[],
  frameCount: number
): PageReplacementResult {
  const frames: (number | null)[] = Array(frameCount).fill(null);
  const steps: PageStep[] = [];
  const logs: string[] = [`Starting FIFO Page Replacement with ${frameCount} frames...`];

  let totalHits = 0;
  let totalFaults = 0;
  // Queue to track frame indices in arrival order
  const fifoQueue: number[] = [];

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];
    const frameIndex = frames.indexOf(page);

    if (frameIndex !== -1) {
      // Hit!
      totalHits++;
      steps.push({
        stepIndex: i,
        page,
        frames: [...frames],
        isHit: true,
        evictedPage: null,
        explanation: `Page ${page} is already in frame ${frameIndex} (Page Hit).`,
      });
      logs.push(`Step ${i + 1}: Ref ${page} -> HIT in Frame ${frameIndex}`);
    } else {
      // Fault!
      totalFaults++;
      const emptyIdx = frames.indexOf(null);
      let evictedPage: number | null = null;

      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        fifoQueue.push(emptyIdx);
        steps.push({
          stepIndex: i,
          page,
          frames: [...frames],
          isHit: false,
          evictedPage: null,
          explanation: `Page ${page} loaded into empty frame ${emptyIdx} (Page Fault).`,
        });
        logs.push(`Step ${i + 1}: Ref ${page} -> FAULT (Loaded into empty Frame ${emptyIdx})`);
      } else {
        // Evict FIFO head
        const victimFrameIdx = fifoQueue.shift()!;
        evictedPage = frames[victimFrameIdx];
        frames[victimFrameIdx] = page;
        fifoQueue.push(victimFrameIdx);

        steps.push({
          stepIndex: i,
          page,
          frames: [...frames],
          isHit: false,
          evictedPage,
          explanation: `Page ${page} caused Page Fault. Evicted oldest Page ${evictedPage} from frame ${victimFrameIdx}.`,
        });
        logs.push(
          `Step ${i + 1}: Ref ${page} -> FAULT (Evicted Page ${evictedPage} from Frame ${victimFrameIdx})`
        );
      }
    }
  }

  const hitRatio = referenceString.length > 0 ? parseFloat(((totalHits / referenceString.length) * 100).toFixed(2)) : 0;
  const faultRatio = referenceString.length > 0 ? parseFloat(((totalFaults / referenceString.length) * 100).toFixed(2)) : 0;

  return {
    algorithm: "FIFO",
    algorithmName: "First-In, First-Out (FIFO)",
    frameCount,
    referenceString,
    steps,
    totalHits,
    totalFaults,
    hitRatio,
    faultRatio,
    logs,
  };
}

export function simulateLRU(
  referenceString: number[],
  frameCount: number
): PageReplacementResult {
  const frames: (number | null)[] = Array(frameCount).fill(null);
  const lastUsed: number[] = Array(frameCount).fill(-1);
  const steps: PageStep[] = [];
  const logs: string[] = [`Starting LRU Page Replacement with ${frameCount} frames...`];

  let totalHits = 0;
  let totalFaults = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];
    const frameIndex = frames.indexOf(page);

    if (frameIndex !== -1) {
      // Hit!
      totalHits++;
      lastUsed[frameIndex] = i;
      steps.push({
        stepIndex: i,
        page,
        frames: [...frames],
        isHit: true,
        evictedPage: null,
        explanation: `Page ${page} hit in frame ${frameIndex}. Recency timestamp updated to ${i}.`,
      });
      logs.push(`Step ${i + 1}: Ref ${page} -> HIT in Frame ${frameIndex}`);
    } else {
      // Fault!
      totalFaults++;
      const emptyIdx = frames.indexOf(null);
      let evictedPage: number | null = null;

      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        lastUsed[emptyIdx] = i;
        steps.push({
          stepIndex: i,
          page,
          frames: [...frames],
          isHit: false,
          evictedPage: null,
          explanation: `Page ${page} loaded into empty frame ${emptyIdx} (Page Fault).`,
        });
        logs.push(`Step ${i + 1}: Ref ${page} -> FAULT (Loaded into empty Frame ${emptyIdx})`);
      } else {
        // Evict LRU (smallest lastUsed timestamp)
        let minTime = Infinity;
        let lruFrameIdx = 0;

        for (let f = 0; f < frameCount; f++) {
          if (lastUsed[f] < minTime) {
            minTime = lastUsed[f];
            lruFrameIdx = f;
          }
        }

        evictedPage = frames[lruFrameIdx];
        frames[lruFrameIdx] = page;
        lastUsed[lruFrameIdx] = i;

        steps.push({
          stepIndex: i,
          page,
          frames: [...frames],
          isHit: false,
          evictedPage,
          explanation: `Page ${page} caused Page Fault. Evicted least recently used Page ${evictedPage} (last accessed at step ${minTime + 1}).`,
        });
        logs.push(
          `Step ${i + 1}: Ref ${page} -> FAULT (Evicted LRU Page ${evictedPage} from Frame ${lruFrameIdx})`
        );
      }
    }
  }

  const hitRatio = referenceString.length > 0 ? parseFloat(((totalHits / referenceString.length) * 100).toFixed(2)) : 0;
  const faultRatio = referenceString.length > 0 ? parseFloat(((totalFaults / referenceString.length) * 100).toFixed(2)) : 0;

  return {
    algorithm: "LRU",
    algorithmName: "Least Recently Used (LRU)",
    frameCount,
    referenceString,
    steps,
    totalHits,
    totalFaults,
    hitRatio,
    faultRatio,
    logs,
  };
}

export function simulateOptimal(
  referenceString: number[],
  frameCount: number
): PageReplacementResult {
  const frames: (number | null)[] = Array(frameCount).fill(null);
  const steps: PageStep[] = [];
  const logs: string[] = [
    `Starting Optimal Page Replacement with ${frameCount} frames (Offline Oracle Benchmark)...`,
  ];

  let totalHits = 0;
  let totalFaults = 0;

  for (let i = 0; i < referenceString.length; i++) {
    const page = referenceString[i];
    const frameIndex = frames.indexOf(page);

    if (frameIndex !== -1) {
      totalHits++;
      steps.push({
        stepIndex: i,
        page,
        frames: [...frames],
        isHit: true,
        evictedPage: null,
        explanation: `Page ${page} hit in frame ${frameIndex}.`,
      });
      logs.push(`Step ${i + 1}: Ref ${page} -> HIT in Frame ${frameIndex}`);
    } else {
      totalFaults++;
      const emptyIdx = frames.indexOf(null);
      let evictedPage: number | null = null;

      if (emptyIdx !== -1) {
        frames[emptyIdx] = page;
        steps.push({
          stepIndex: i,
          page,
          frames: [...frames],
          isHit: false,
          evictedPage: null,
          explanation: `Page ${page} loaded into empty frame ${emptyIdx} (Page Fault).`,
        });
        logs.push(`Step ${i + 1}: Ref ${page} -> FAULT (Loaded into empty Frame ${emptyIdx})`);
      } else {
        // Optimal lookahead: find next use of each frame
        let victimFrameIdx = -1;
        let farthestUse = -1;

        for (let f = 0; f < frameCount; f++) {
          const currentPage = frames[f]!;
          // Search in remaining future references
          let nextUse = -1;
          for (let j = i + 1; j < referenceString.length; j++) {
            if (referenceString[j] === currentPage) {
              nextUse = j;
              break;
            }
          }

          if (nextUse === -1) {
            // Not used again in the future! Top candidate to evict
            victimFrameIdx = f;
            farthestUse = Infinity;
            break;
          } else if (nextUse > farthestUse) {
            farthestUse = nextUse;
            victimFrameIdx = f;
          }
        }

        if (victimFrameIdx === -1) victimFrameIdx = 0;

        evictedPage = frames[victimFrameIdx];
        frames[victimFrameIdx] = page;

        const futureNote =
          farthestUse === Infinity
            ? "never referenced again"
            : `referenced farthest at step ${farthestUse + 1}`;

        steps.push({
          stepIndex: i,
          page,
          frames: [...frames],
          isHit: false,
          evictedPage,
          explanation: `Page ${page} caused Page Fault. Evicted Page ${evictedPage} from frame ${victimFrameIdx} (${futureNote}).`,
        });
        logs.push(
          `Step ${i + 1}: Ref ${page} -> FAULT (Evicted Optimal Page ${evictedPage} from Frame ${victimFrameIdx}: ${futureNote})`
        );
      }
    }
  }

  const hitRatio = referenceString.length > 0 ? parseFloat(((totalHits / referenceString.length) * 100).toFixed(2)) : 0;
  const faultRatio = referenceString.length > 0 ? parseFloat(((totalFaults / referenceString.length) * 100).toFixed(2)) : 0;

  return {
    algorithm: "OPTIMAL",
    algorithmName: "Optimal Page Replacement (Belady's)",
    frameCount,
    referenceString,
    steps,
    totalHits,
    totalFaults,
    hitRatio,
    faultRatio,
    logs,
  };
}

export function compareAllPageReplacement(
  referenceString: number[],
  frameCount: number
): PageReplacementResult[] {
  return [
    simulateFIFO(referenceString, frameCount),
    simulateLRU(referenceString, frameCount),
    simulateOptimal(referenceString, frameCount),
  ];
}
