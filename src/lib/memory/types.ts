export interface MemoryBlock {
  id: string;
  size: number;
  allocatedProcessId: string | null;
  processName?: string;
  allocatedSize?: number;
  internalFrag: number;
}

export interface MemoryRequest {
  id: string;
  processName: string;
  size: number;
}

export interface AllocationEvent {
  requestId: string;
  processName: string;
  size: number;
  allocatedBlockId: string | null;
  status: "SUCCESS" | "FAILED";
  internalFrag: number;
  reason?: string;
}

export type ContiguousStrategy = "FIRST_FIT" | "BEST_FIT" | "WORST_FIT";

export interface ContiguousResult {
  strategy: ContiguousStrategy;
  strategyName: string;
  finalBlocks: MemoryBlock[];
  events: AllocationEvent[];
  totalMemory: number;
  totalAllocated: number;
  totalFree: number;
  totalInternalFrag: number;
  externalFrag: number;
  successCount: number;
  failureCount: number;
  logs: string[];
}

export type PageReplacementAlgorithm = "FIFO" | "LRU" | "OPTIMAL";

export interface PageStep {
  stepIndex: number;
  page: number;
  frames: (number | null)[];
  isHit: boolean;
  evictedPage: number | null;
  explanation: string;
}

export interface PageReplacementResult {
  algorithm: PageReplacementAlgorithm;
  algorithmName: string;
  frameCount: number;
  referenceString: number[];
  steps: PageStep[];
  totalHits: number;
  totalFaults: number;
  hitRatio: number;
  faultRatio: number;
  logs: string[];
}
