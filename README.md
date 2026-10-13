# OScope — Interactive Operating System Resource Management & Performance Analysis Platform

[![OS Lab Project](https://img.shields.io/badge/Course-Operating%20Systems%20Lab%20(40%20Marks)-cyan)](https://github.com)
[![Tests](https://img.shields.io/badge/Vitest-19%2F19%20Passing-emerald)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2%20App%20Router-violet)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://www.typescriptlang.org)
[![License](https://img.shields.io/badge/Academic-VTOP%20Compliant-amber)](https://github.com)

**OScope** is an interactive, browser-based Operating Systems laboratory and resource-management simulation platform built for university-level engineering project demonstrations (B.Tech Computer Science & Engineering). 

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

### 🎓 Faculty Guided Demo & Viva Mode
- Integrated walkthrough modal tailored for university evaluations (Review I & Review II).
- Step-by-step checklist of demonstration goals, talking points for the evaluators, and likely viva voce questions with model academic answers.

---

## 👥 Student Team Responsibilities (Two-Member Project)

| Module / Area | Team Member 1 | Team Member 2 |
| :--- | :--- | :--- |
| **CPU Scheduling Engine** | Algorithm Design (FCFS, SJF, SRTF, Priority) | Round Robin implementation & Gantt Chart component |
| **Memory Management** | Contiguous Placement (First/Best/Worst Fit) | Paging & Page Replacement (FIFO, LRU, Optimal) |
| **Deadlock Lab** | Banker's Safety Algorithm & Need Matrix | Resource-Request Simulator & Tentative Rollback |
| **Process Control** | 5-State Lifecycle Transition State Machine | PCB Management Table, Search & Filter UI |
| **Testing & Analytics** | Vitest Automated Unit Tests (19 Test Cases) | Analytical Charts, Formulas & Guided Demo Mode |

---

## 💻 Quick Start Guide (Windows Laptop)

### Prerequisites
- **Node.js**: v18.0.0 or later (Tested on Node v24.18.0 and npm 11.16.0)
- **PowerShell** or **Command Prompt**

> **Note for Windows Users**: On Windows PowerShell, script execution policies may block `npm.ps1`. Always run `npm.cmd` and `npx.cmd` in PowerShell, or run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` if needed.

---

### Step-by-Step Execution

#### 1. Open the project folder
Open PowerShell in the project directory:
```powershell
cd "c:\Users\Asus\Downloads\Os group project"
```

#### 2. Install dependencies
```powershell
npm.cmd install
```

#### 3. Run the automated test suite
To run all 19 unit tests and verify mathematical correctness:
```powershell
npm.cmd test
# or
npx.cmd vitest run
```
**Expected Test Output**:
```text
 ✓ src/__tests__/contiguous.test.ts (3 tests)
 ✓ src/__tests__/bankers.test.ts (6 tests)
 ✓ src/__tests__/cpu.test.ts (6 tests)
 ✓ src/__tests__/pageReplacement.test.ts (4 tests)

 Test Files  4 passed (4)
      Tests  19 passed (19)
```

#### 4. Start the development server
```powershell
npm.cmd run dev
```

#### 5. Open in your browser
Navigate to:
```
http://localhost:3000
```

#### 6. Build for production (Optional)
```powershell
npm.cmd run build
npm.cmd run start
```

---

## 🧪 Demonstration Sequence for Faculty Review

Follow this quick 5-step sequence during your lab evaluation:

1. **Overview & Problem Statement**:
   - Open `http://localhost:3000`.
   - Point out the 5 core modules, 14 algorithms, and zero external cloud dependencies.
2. **CPU Scheduling Demo**:
   - Click **CPU Scheduler** tab.
   - Select the **Galvin Benchmark** preset.
   - Click **Play** to observe the Gantt chart scrub through execution.
   - Click **⚡ Compare All** to show the side-by-side benchmark comparing FCFS, SJF, SRTF, Priority, and Round Robin.
3. **Memory Management Demo**:
   - Click **Memory & Paging** tab.
   - Under **Contiguous Partition Allocation**, select **Galvin Benchmark**. Click **⚡ Compare All** to demonstrate how Best Fit succeeds where First Fit and Worst Fit fail.
   - Switch to **Paging & Page Replacement**, select **Galvin 20-Page Reference String**, and click **Optimal (Belady)** to show the 9-fault lower bound.
4. **Banker's Algorithm Demo**:
   - Click **Deadlock & Banker's** tab.
   - Show the auto-calculated Need matrix and the safe sequence $\langle P_1 \to P_3 \to P_4 \to P_0 \to P_2 \rangle$.
   - Under **Resource-Request Simulator**, click **Evaluate Request** for Process $P_1$ requesting $[1, 0, 2]$. Show the tentative allocation being verified safe and granted.
5. **Process Lifecycle Demo**:
   - Click **Process Control** tab.
   - Click **Create Process**, spawn a process, and dispatch it through the 5-state lifecycle model.
6. **Viva Assistance**:
   - Click the green **Faculty Guided Demo** button in the header at any time to open the built-in viva guide with model answers.

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
│   │   └── presentation/      # GuidedDemoModal (Faculty viva guide)
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
