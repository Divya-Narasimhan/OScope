import { MemoryRequest } from "../memory/types";

export interface ContiguousPreset {
  id: string;
  title: string;
  description: string;
  blocks: { id: string; size: number }[];
  requests: MemoryRequest[];
}

export const CONTIGUOUS_PRESETS: ContiguousPreset[] = [
  {
    id: "galvin_allocation",
    title: "Galvin Benchmark (5 Partitions, 4 Requests)",
    description: "Classic OS textbook example where First Fit, Best Fit, and Worst Fit yield contrasting internal fragmentation.",
    blocks: [
      { id: "B1", size: 100 },
      { id: "B2", size: 500 },
      { id: "B3", size: 200 },
      { id: "B4", size: 300 },
      { id: "B5", size: 600 },
    ],
    requests: [
      { id: "P1", processName: "P1", size: 212 },
      { id: "P2", processName: "P2", size: 417 },
      { id: "P3", processName: "P3", size: 112 },
      { id: "P4", processName: "P4", size: 426 },
    ],
  },
  {
    id: "external_frag_demo",
    title: "External Fragmentation Trap",
    description: "Sufficient total memory exists, but no contiguous partition can fit the final request.",
    blocks: [
      { id: "B1", size: 150 },
      { id: "B2", size: 200 },
      { id: "B3", size: 180 },
    ],
    requests: [
      { id: "P1", processName: "P1", size: 140 },
      { id: "P2", processName: "P2", size: 190 },
      { id: "P3", processName: "P3", size: 100 },
    ],
  },
];

export interface PageReplacementPreset {
  id: string;
  title: string;
  description: string;
  frameCount: number;
  referenceString: number[];
}

export const PAGE_PRESETS: PageReplacementPreset[] = [
  {
    id: "galvin_pages",
    title: "Galvin 20-Page Reference String (3 Frames)",
    description: "The classic textbook reference string: 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1",
    frameCount: 3,
    referenceString: [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2, 1, 2, 0, 1, 7, 0, 1],
  },
  {
    id: "belady_anomaly",
    title: "Belady's Anomaly Demo (FIFO)",
    description: "Shows how increasing frames from 3 to 4 in FIFO can paradoxically increase page faults!",
    frameCount: 3,
    referenceString: [1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5],
  },
  {
    id: "temporal_locality",
    title: "High Temporal Locality (LRU Advantage)",
    description: "Frequently loops over a working set, demonstrating why LRU shines in realistic programs.",
    frameCount: 4,
    referenceString: [1, 2, 3, 1, 2, 4, 1, 2, 5, 1, 2, 3],
  },
];
