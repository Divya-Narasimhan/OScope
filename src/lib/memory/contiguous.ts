import {
  MemoryBlock,
  MemoryRequest,
  ContiguousStrategy,
  ContiguousResult,
  AllocationEvent,
} from "./types";

export function simulateContiguousAllocation(
  initialBlocks: { id: string; size: number }[],
  requests: MemoryRequest[],
  strategy: ContiguousStrategy
): ContiguousResult {
  const blocks: MemoryBlock[] = initialBlocks.map((b) => ({
    id: b.id,
    size: b.size,
    allocatedProcessId: null,
    processName: undefined,
    allocatedSize: undefined,
    internalFrag: 0,
  }));

  const events: AllocationEvent[] = [];
  const logs: string[] = [`Starting ${strategy} Contiguous Memory Allocation simulation...`];
  let successCount = 0;
  let failureCount = 0;

  for (const req of requests) {
    let chosenBlockIdx = -1;

    // Filter candidate free blocks
    const candidateIndices = blocks
      .map((b, idx) => ({ block: b, idx }))
      .filter(({ block }) => block.allocatedProcessId === null && block.size >= req.size);

    if (candidateIndices.length > 0) {
      if (strategy === "FIRST_FIT") {
        chosenBlockIdx = candidateIndices[0].idx;
      } else if (strategy === "BEST_FIT") {
        candidateIndices.sort((a, b) => {
          const fragA = a.block.size - req.size;
          const fragB = b.block.size - req.size;
          if (fragA !== fragB) return fragA - fragB;
          return a.idx - b.idx;
        });
        chosenBlockIdx = candidateIndices[0].idx;
      } else if (strategy === "WORST_FIT") {
        candidateIndices.sort((a, b) => {
          const fragA = a.block.size - req.size;
          const fragB = b.block.size - req.size;
          if (fragA !== fragB) return fragB - fragA;
          return a.idx - b.idx;
        });
        chosenBlockIdx = candidateIndices[0].idx;
      }
    }

    if (chosenBlockIdx !== -1) {
      const blk = blocks[chosenBlockIdx];
      const internalFrag = blk.size - req.size;
      blk.allocatedProcessId = req.id;
      blk.processName = req.processName;
      blk.allocatedSize = req.size;
      blk.internalFrag = internalFrag;

      events.push({
        requestId: req.id,
        processName: req.processName,
        size: req.size,
        allocatedBlockId: blk.id,
        status: "SUCCESS",
        internalFrag,
        reason: `Allocated to ${blk.id} (${blk.size} KB). Internal fragmentation: ${internalFrag} KB`,
      });

      logs.push(
        `✓ [SUCCESS] Process ${req.processName} (${req.size} KB) allocated to Block ${blk.id} (Size: ${blk.size} KB). Internal Fragment = ${internalFrag} KB.`
      );
      successCount++;
    } else {
      // Check for external fragmentation
      const totalFree = blocks
        .filter((b) => b.allocatedProcessId === null)
        .reduce((sum, b) => sum + b.size, 0);

      const hasExternalFrag = totalFree >= req.size;
      const reason = hasExternalFrag
        ? `Allocation failed due to External Fragmentation! Total free memory is ${totalFree} KB >= requested ${req.size} KB, but no contiguous block is large enough.`
        : `Allocation failed: Total free memory (${totalFree} KB) is strictly less than requested ${req.size} KB.`;

      events.push({
        requestId: req.id,
        processName: req.processName,
        size: req.size,
        allocatedBlockId: null,
        status: "FAILED",
        internalFrag: 0,
        reason,
      });

      logs.push(`✗ [FAILED] Process ${req.processName} (${req.size} KB): ${reason}`);
      failureCount++;
    }
  }

  const totalMemory = blocks.reduce((sum, b) => sum + b.size, 0);
  const totalAllocated = blocks
    .filter((b) => b.allocatedProcessId !== null)
    .reduce((sum, b) => sum + (b.allocatedSize ?? 0), 0);
  const totalInternalFrag = blocks.reduce((sum, b) => sum + b.internalFrag, 0);
  const totalFree = blocks
    .filter((b) => b.allocatedProcessId === null)
    .reduce((sum, b) => sum + b.size, 0);

  // External fragmentation indicator
  const externalFrag = totalFree;

  const strategyNames: Record<ContiguousStrategy, string> = {
    FIRST_FIT: "First Fit",
    BEST_FIT: "Best Fit",
    WORST_FIT: "Worst Fit",
  };

  return {
    strategy,
    strategyName: strategyNames[strategy],
    finalBlocks: blocks,
    events,
    totalMemory,
    totalAllocated,
    totalFree,
    totalInternalFrag,
    externalFrag,
    successCount,
    failureCount,
    logs,
  };
}

export function compareAllContiguousStrategies(
  initialBlocks: { id: string; size: number }[],
  requests: MemoryRequest[]
): ContiguousResult[] {
  const strategies: ContiguousStrategy[] = ["FIRST_FIT", "BEST_FIT", "WORST_FIT"];
  return strategies.map((s) => simulateContiguousAllocation(initialBlocks, requests, s));
}
