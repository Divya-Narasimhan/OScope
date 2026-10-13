# OScope — Interactive Operating System Resource Management & Performance Analysis Platform

[![Tests](https://img.shields.io/badge/Vitest-19%2F19%20Passing-emerald)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-violet)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org)

**OScope** is an interactive, browser-based operating system resource-management and performance analysis platform.

Rather than displaying static numbers or canned dashboards, OScope contains genuine algorithmic simulation engines implemented strictly in accordance with textbook operating system principles (*Silberschatz, Galvin & Gagne, "Operating System Concepts", 10th Edition*).

---

## 🌟 Key Features & Laboratory Modules

### ⚡ Module A: CPU Scheduling Laboratory
- **Algorithms Implemented**:
  1. First Come First Served (FCFS)
  2. Shortest Job First (SJF) — Non-Preemptive
  3. Shortest Remaining Time First (SRTF) — Preemptive
  4. Priority Scheduling — Non-Preemptive
  5. Priority Scheduling — Preemptive
  6. Round Robin (RR) — with configurable Time Quantum ($q$)
- **Simulation Capabilities**:
  - Interactive Gantt chart with live playback scrubber, play/pause controls, and adjustable playback speeds ($0.5\times, 1\times, 2\times, 4\times$).
  - Full support for arrival times ($AT \ge 0$), simultaneous arrivals, and **CPU Idle intervals** where the CPU waits for newly arriving processes.
  - Deterministic tie-breaking policy: Earliest arrival time, followed by Process ID index.
  - Mathematically accurate individual and average metrics:
    - $\text{Turnaround Time (TAT)} = \text{Completion Time (CT)} - \text{Arrival Time (AT)}$
    - $\text{Waiting Time (WT)} = \text{Turnaround Time (TAT)} - \text{Burst Time (BT)}$
    - $\text{Response Time (RT)} = \text{Time of First CPU Execution} - \text{Arrival Time (AT)}$
    - $\text{CPU Utilization (\%)} = \left(\frac{\text{Total Busy Time}}{\text{Total Horizon Time}}\right) \times 100\%$
    - $\text{Throughput} = \frac{\text{Processes Completed}}{\text{Total Horizon Time}}$
  - **Cross-Algorithm Comparison Mode**: Runs all 6 schedulers simultaneously over the exact same workload, identifying the provably optimal scheduler with comparative bar graphs and algorithmic reasoning.
  - Step-by-step kernel context-switch audit logs.
  - Workload export to JSON.

### 💾 Module B: Memory Management & Paging Laboratory
- **Part 1: Contiguous Memory Partition Allocation**:
  - **First Fit**: Scans partitions sequentially and allocates to the first block of sufficient size.
  - **Best Fit**: Allocates to the smallest free partition of sufficient size, minimizing the internal fragmentation left in that block.
  - **Worst Fit**: Allocates to the largest free partition, leaving the largest leftover chunk.
  - Visual physical RAM partition map displaying process footprints, internal fragmentation slices, and remaining free space.
  - **External Fragmentation Trap Detection**: Formally diagnoses when an allocation fails because total free RAM is sufficient, but no single partition is contiguously large enough.
  - Side-by-side strategy comparator on identical partition workloads.
- **Part 2: Virtual Memory Page Replacement**:
  - **FIFO (First-In, First-Out)**: Queue-based eviction; includes Belady's Anomaly demo where increasing frame count from 3 to 4 increases page faults.
  - **LRU (Least Recently Used)**: Recency-timestamped tracking of page usage.
  - **Optimal (Belady's Algorithm)**: Offline benchmark that looks forward in the reference string to evict the page unreferenced for the longest future duration.
  - Interactive 2D Frame Allocation Matrix (Rows = Physical Frames, Columns = Step-by-Step Page References) with Hit/Fault icons and evicted page identification.
  - Step-by-step playback controls and academic notes on offline vs. online policies.

### 🔒 Module C: Resource Allocation & Deadlock Laboratory
- **Banker's Algorithm (Deadlock Avoidance)**:
  - Multi-resource matrix representation: Allocation ($n \times m$), Maximum Claim ($n \times m$), and dynamically computed Need matrix ($\text{Need}[i][j] = \text{Max}[i][j] - \text{Allocation}[i][j]$).
  - Safety Algorithm: Step-by-step evolution of the $\text{Work}$ vector ($\text{Work} = \text{Work} + \text{Allocation}_i$).
  - Safe Sequence Generator ($\langle P_1 \to P_3 \to P_4 \to P_0 \to P_2 \rangle$) or Unsafe state alert.
  - **Theoretical Distinction**: Clear explanation that an **Unsafe State $\neq$ Deadlock**, but rather an inability to guarantee deadlock avoidance under maximum demand.
- **Dynamic Resource-Request Algorithm**:
  - Validates conditions: $\text{Request}_i \le \text{Need}_i$ and $\text{Request}_i \le \text{Available}$.
  - Performs tentative allocation, checks resulting system safety, and either commits or safely rolls back.

### 🖥️ Module D: Process Lifecycle & System Control Workspace
- **Five-State OS Process Lifecycle Model**:
  - States: `NEW`, `READY`, `RUNNING`, `WAITING` (Blocked for I/O), and `TERMINATED`.
  - State queue visualizer with interactive dispatching, timer preemption, I/O wait blocking, and wakeup actions.
  - Process Control Block (PCB) table with search, status filtering, priority ordering, memory requirements, and burst tracking.
  - Dynamic Process Creation modal.
  - Real-time kernel event audit log documenting the operating system rationale for each state change.

### 📊 Module E: Performance Analytics & Theory Reference
- Shared analytical summary connecting scheduling metrics, memory utilization, page fault rates, and safety tests.
- Reference cards with LaTeX-formatted equations and formal definitions.
- Algorithmic Complexity & Trade-Off Matrix (Time complexity, advantages, disadvantages, and vulnerabilities).
- 1-click complete laboratory data export in JSON format.

---

## 🛡️ Known Limitations & Explicit Scope Notes
- **Simulation Scope**: OScope is a discrete-event educational simulator running client-side in TypeScript/React. It does not manipulate real Windows or Linux kernel task tables or hardware page tables.
- **Optimal Replacement**: Optimal page replacement is an offline oracle algorithm requiring complete knowledge of future references; it is documented in the UI as an academic benchmark rather than an implementable online kernel replacement policy.
- **Banker's Algorithm**: Banker's algorithm assumes known maximum resource claims declared prior to process execution.

---

## 📁 Source Directory Structure

```text
├── package.json               # Project manifest and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS styling with custom theme
├── vitest.config.ts           # Vitest unit test runner configuration
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with metadata and dark theme
│   │   ├── page.tsx           # Main application coordinator
│   │   └── globals.css        # Global CSS with dark graphite & glassmorphism
│   ├── components/
│   │   ├── Navbar.tsx         # Top navigation bar
│   │   ├── OverviewLab.tsx    # Platform overview and landing workspace
│   │   ├── common/            # Reusable UI components (Button, Card, Badge, Modal, MetricStat)
│   │   ├── cpu/               # GanttChart, ProcessTable, CpuSchedulerLab, CpuComparisonView
│   │   ├── memory/            # MemoryLab, ContiguousAllocationView, PageReplacementView
│   │   ├── deadlock/          # DeadlockLab, MatrixGrid, BankersSafetyVisualizer
│   │   ├── process/           # ProcessMonitorLab (5-state lifecycle PCB workspace)
│   │   ├── analytics/         # AnalyticsLab (Formulas, trade-off matrix, JSON exporter)
│   ├── lib/
│   │   ├── cpu/               # Pure FCFS, SJF, SRTF, Priority, Round Robin engines
│   │   ├── memory/            # Pure First/Best/Worst Fit & FIFO/LRU/Optimal engines
│   │   ├── deadlock/          # Pure Banker's Safety & Resource Request engines
│   │   ├── process/           # Process lifecycle state machine logic
│   │   └── presets/           # Academic benchmark presets (Galvin et al.)
│   └── __tests__/             # 19 automated Vitest test cases
│       ├── cpu.test.ts        # CPU scheduling tests
│       ├── contiguous.test.ts # Memory allocation tests
│       ├── pageReplacement.test.ts # Paging replacement tests
│       └── bankers.test.ts    # Banker's algorithm tests
```
