# MCP Zero-Trust Gateway Architecture Flow

Below is the comprehensive architectural flow diagram of the MCP Zero-Trust Gateway, visualizing how each module interacts to produce the final result.

The system is divided into two major phases:
1. **Onboarding Phase**: Triggered when a new tool is registered. It involves static scanning, sandbox profiling, and comparing observed behavior against expected declarations to store a trusted verdict.
2. **Runtime Phase**: Triggered when the LLM Agent calls a tool. It leverages the trust store, enforces live policies, forwards the call to the real tool, and filters the response before returning the final result to the agent.

```mermaid
graph TD
    %% Define styles
    classDef actor fill:#f9f9f9,stroke:#333,stroke-width:2px,color:#000;
    classDef process fill:#e1f5fe,stroke:#0288d1,stroke-width:2px,color:#000;
    classDef analysis fill:#e8f5e9,stroke:#388e3c,stroke-width:2px,color:#000;
    classDef storage fill:#fff8e1,stroke:#ffa000,stroke-width:2px,color:#000;
    classDef external fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,color:#000;
    classDef result fill:#ffebee,stroke:#d32f2f,stroke-width:2px,color:#000;

    %% Actors
    Operator((Operator)):::actor
    LLMAgent((LLM Agent)):::actor
    Dashboard((Dashboard SPA)):::actor

    %% Onboarding Flow (L1-L3)
    subgraph Onboarding [Onboarding Phase]
        direction TB
        Orchestrator[Gateway Orchestrator]:::process
        ScannerL1[L1: Static Scanner<br>manifest_parser.py]:::analysis
        ProfilerL2[L2: Sandbox Profiler<br>driver.py + profiler.py]:::analysis
        ComparatorL3[L3: Comparator<br>scanner/comparator.py]:::analysis
    end

    %% Runtime Flow (L4-L6)
    subgraph Runtime [Runtime Phase]
        direction TB
        ProxyL5[L5: Runtime Proxy<br>gateway/proxy.py]:::process
        PolicyEngineL4[L4: Policy Engine<br>policy_engine.py]:::analysis
        MCPClient[MCP Stdio Client<br>mcp_client.py]:::process
        ResponseFilterL6[L6: Response Filter<br>response_filter.py]:::analysis
    end

    %% External & Storage
    TrustStore[(SQLite Trust Store<br>registered_tools)]:::storage
    LogStore[(SQLite Activity Logs<br>logs table)]:::storage
    RealTool[Real MCP Tool Server<br>demo_tools/]:::external
    FinalResult([Final Result Returned]):::result

    %% Onboarding Connections
    Operator -- "1. POST /register" --> Orchestrator
    Orchestrator -- "2. Parse Manifest" --> ScannerL1
    Orchestrator -- "3. Strace Profiling" --> ProfilerL2
    ProfilerL2 -- "4. Observed Caps Profile" --> ComparatorL3
    ScannerL1 -- "4. Expected Caps" --> ComparatorL3
    ComparatorL3 -- "5. Output Verdict" --> TrustStore

    %% Runtime Connections
    LLMAgent -- "6. tools/call" --> ProxyL5
    ProxyL5 -- "7. Verify Trust Status" --> TrustStore
    ProxyL5 -- "8. Validate Args & Caps" --> PolicyEngineL4
    ProxyL5 -- "9. Forward if Allowed" --> MCPClient
    MCPClient -- "10. Stdio Subprocess" --> RealTool
    RealTool -- "11. Raw Response" --> MCPClient
    MCPClient -- "12. Route Response" --> ResponseFilterL6
    ResponseFilterL6 -- "13. Scan for Prompt Injection" --> ProxyL5
    ProxyL5 -- "14. Log Decision" --> LogStore
    ProxyL5 -- "15. Deliver Output" --> FinalResult
    FinalResult -.-> LLMAgent

    %% Dashboard Connections
    Dashboard -- "GET /verdicts, /profiles" --> TrustStore
    Dashboard -- "GET /logs, /timeline" --> LogStore
```

### Flow Breakdown

**How we get the final result:**
1. **Tool Registration**: The `Operator` registers a tool with the `Gateway Orchestrator`.
2. **Dual Analysis**: The `Static Scanner (L1)` computes what the tool *should* do, while the `Sandbox Profiler (L2)` captures what the tool *actually* does at the system call level.
3. **Verdict Generation**: The `Comparator (L3)` calculates the delta (undeclared capabilities), assigns a severity, and saves a `Verdict` to the `SQLite Trust Store`.
4. **Agent Invocation**: The `LLM Agent` attempts to use the tool via the `Runtime Proxy (L5)`.
5. **Runtime Enforcement**: The Proxy immediately checks the `Trust Store`. If trusted, it passes the call to the `Policy Engine (L4)` to check against live baseline rules.
6. **Execution & Filtering**: If allowed, the `MCP Client` executes the real tool server. The raw response is caught and scanned by the `Response Filter (L6)` for malicious injections.
7. **Final Delivery**: After all checks pass and the event is written to the `Activity Logs`, the cleansed data flows back as the `Final Result` to the `LLM Agent`.