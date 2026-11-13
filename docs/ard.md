# Architecture Requirements Document (ARD)

> Replace all `<PLACEHOLDER>` values. Every material architecture decision or constraint should have a stable ID that feature specifications can reference.

## Document Metadata

- **Product/Application:** Daily Task Management Web Application
- **Document ID:** ARD-TASKAPP
- **Version:** 0.1
- **Status:** Draft
- **Architecture Owner:** TBD (see ARC-OQ-001)
- **Contributors:** TBD (see ARC-OQ-002)
- **Last Updated:** 2026-11-13
- **Reference PRD:** `PRD.md`

---

## 1. Architecture Summary

The Daily Task Management Web Application will use a simple three-tier local/demo architecture: a React browser frontend, a Node.js/Express REST API, and a PostgreSQL database. The frontend provides the responsive task dashboard and task forms. The backend owns REST API behavior, persistence orchestration, error responses, and database access. PostgreSQL stores task records so created, edited, completed, and deleted task state survives browser refreshes.

The first release is intentionally minimal for a small-business portfolio/demo context. It has no login, no user accounts, no task sharing, and no hosted production environment. The architecture prioritizes straightforward CRUD behavior, database persistence, maintainable separation between UI/API/data concerns, and traceability to the approved PRD.

## 2. Architecture Drivers

- PRD-FR-001 — Users must be able to create tasks with title, description, due date, priority, and default Pending status.
- PRD-FR-002 — Empty task titles must be rejected before creation or update is accepted.
- PRD-FR-003 — Users must be able to view created tasks with title, due date, priority, and status.
- PRD-FR-004 — Users must be able to edit existing task records.
- PRD-FR-005 — Users must be able to mark Pending tasks as Completed.
- PRD-FR-006 — Users must be able to delete task records.
- PRD-FR-007 — Users must be able to filter tasks by All, Pending, or Completed.
- PRD-FR-008 — Tasks must be stored in a database and remain available after refresh.
- PRD-FR-009 — The system must expose REST API capabilities for task CRUD, completion, retrieval, and filtering.
- PRD-FR-010 — API and database failures must produce clear user-facing errors while preserving user context.
- PRD-NFR-001 — The UI must support desktop and mobile layouts.
- PRD-NFR-002 — The UI must support basic accessibility through keyboard-usable controls, visible labels, and readable contrast.
- CON-001 — The company context is a small business.
- CON-002 — The first release must include a REST API and database.
- CON-003 — The implementation stack is flexible in the PRD, but this ARD selects React, Node.js/Express, and PostgreSQL.
- CON-004 — The first release must remain minimal and focused on demo scope.
- CON-005 — No fixed deadline or budget is set for the first release.
- CON-006 — No login or user-account functionality is included in the first release.

## 3. Architecture Principles

1. Keep the first release intentionally small and aligned to the approved CRUD/demo scope.
2. Make the backend the integration point between the browser UI and persistent task storage.
3. Reuse established repository and platform patterns where appropriate.
4. Keep presentation, orchestration, domain, integration, and persistence concerns separated.
5. Preserve task data through database-backed writes before reporting successful mutations to the UI.
6. Prefer explicit, user-visible error states over silent failures for API and database errors.

## 4. System Context

### 4.1 Actors

- Individual Task User — Uses the browser UI to create, view, edit, complete, delete, and filter personal tasks.
- Browser Runtime — Hosts the React frontend and sends task operation requests to the REST API.
- Task REST API — Receives frontend task requests, validates/processes them, and reads/writes task records in PostgreSQL.
- PostgreSQL Database — Stores task records for persistence across browser refreshes.

### 4.2 External Systems

| ID | System | Purpose | Interface | Owner |
|---|---|---|---|---|
| EXT-001 | None | No external business systems are in scope for the first release | Not applicable | Not applicable |

## 5. Technology Stack

| Layer | Technology | Version/Constraint | Rationale |
|---|---|---|---|
| Frontend | React | Exact version TBD (see ARC-OQ-003) | Provides a modern component-based browser UI for the responsive task dashboard and forms |
| Backend | Node.js with Express | Exact Node.js and Express versions TBD (see ARC-OQ-003) | Provides a straightforward REST API layer for CRUD, filtering, completion, validation, and error handling |
| Data | PostgreSQL | Exact PostgreSQL version TBD (see ARC-OQ-003) | Provides durable relational storage for task persistence across refreshes |
| Hosting | Local/demo-only deployment | No hosted production environment for first release | Matches the approved local/demo scope and avoids introducing deployment complexity not required by the PRD |
| Repository | Monorepo with separate frontend and backend directories | Paths TBD until repository initialization (see ARC-OQ-004) | Keeps UI and API concerns separated while simplifying local demo coordination |

## 6. Logical Architecture

### 6.1 Components

#### COMP-001 — React Task Management UI

- **Responsibility:** Render the responsive task dashboard, task form/edit controls, status filters, validation messages, and user-facing API/database error messages.
- **Inputs:** User task data entry, filter selection, edit/complete/delete actions, REST API responses.
- **Outputs:** REST API requests, rendered task list, validation feedback, error messages.
- **Dependencies:** COMP-002.
- **Repository Area:** `frontend/` (path assumed; see ARC-OQ-004)

#### COMP-002 — Express Task REST API

- **Responsibility:** Provide REST API capabilities for task create, read, update, complete, delete, and status filtering; coordinate validation and persistence; return structured success and error responses.
- **Inputs:** HTTP requests from COMP-001 containing task payloads, task identifiers, and optional status filters.
- **Outputs:** HTTP responses containing task records, filtered task lists, deletion results, and error responses.
- **Dependencies:** COMP-003.
- **Repository Area:** `backend/` (path assumed; see ARC-OQ-004)

#### COMP-003 — Task Persistence Layer

- **Responsibility:** Encapsulate database queries, task table access, and mapping between API/domain objects and PostgreSQL records.
- **Inputs:** Validated task commands and query parameters from COMP-002.
- **Outputs:** Created, updated, retrieved, filtered, completed, or deleted task records/results.
- **Dependencies:** COMP-004.
- **Repository Area:** `backend/` (path assumed; see ARC-OQ-004)

#### COMP-004 — PostgreSQL Task Database

- **Responsibility:** Persist task records, task status, priority, optional due date, optional description, and metadata needed for CRUD behavior.
- **Inputs:** SQL reads/writes from COMP-003.
- **Outputs:** Stored task rows and mutation results.
- **Dependencies:** None within the application boundary.
- **Repository Area:** `backend/migrations/` for schema migrations (path assumed; see ARC-OQ-004)

#### COMP-005 — Database Migration and Local Setup Tooling

- **Responsibility:** Manage versioned database migrations and provide documented local seed/reset procedures.
- **Inputs:** Migration files, local database connection configuration, optional seed/reset command.
- **Outputs:** Initialized or updated PostgreSQL schema for task storage.
- **Dependencies:** COMP-004.
- **Repository Area:** `backend/migrations/` and local setup documentation (paths assumed; see ARC-OQ-004)

### 6.2 Data Flow

1. Individual Task User enters task data or selects a task action in COMP-001.
2. COMP-001 performs UI interaction handling and sends a REST request to COMP-002.
3. COMP-002 validates/processes the request according to task operation rules; the exact frontend/backend validation split is TBD (see ARC-OQ-005).
4. COMP-002 calls COMP-003 to perform the task query or mutation.
5. COMP-003 reads or writes task records in COMP-004.
6. COMP-004 returns persisted task data or database errors to COMP-003.
7. COMP-002 returns a task result, filtered task list, deletion result, or structured error response to COMP-001.
8. COMP-001 updates the dashboard or shows a clear user-facing error while keeping the user on the current screen.

## 7. Architecture Decisions

### ARD-DEC-001 — Select React, Express, and PostgreSQL for the First Release

- **Status:** Accepted
- **Related Requirements:** PRD-FR-008, PRD-FR-009, PRD-NFR-001

**Decision**

Use React for the frontend, Node.js/Express for the REST API, and PostgreSQL for task persistence.

**Rationale**

This stack satisfies the approved requirement for a modern responsive web UI, REST API, and database-backed persistence while remaining familiar and lightweight for a small-business demo application.

**Consequences**

- Enables clear separation between frontend, API, and data layers.
- Requires local setup for Node.js tooling and PostgreSQL.
- Exact package/runtime versions remain to be selected during implementation planning.

**Alternatives Considered**

- Next.js full-stack app with PostgreSQL — Not selected because the user chose separate React frontend and Node.js/Express API architecture.
- Vue with Python/FastAPI and SQLite — Not selected because the user chose React, Express, and PostgreSQL.
- Flexible stack/TBD — Not selected because ARD-level stack selection was made.

### ARD-DEC-002 — Use a Local/Demo-Only Deployment Scope

- **Status:** Accepted
- **Related Requirements:** PRD-FR-008, PRD-FR-009, PRD-NFR-001

**Decision**

The first release will be local/demo-only with no hosted production environment.

**Rationale**

The PRD positions the first release as a minimal small-business portfolio/demo application with no fixed deadline or budget. Local/demo-only deployment avoids unnecessary hosting decisions and operational complexity.

**Consequences**

- No public production availability is required for first release.
- Production-grade hosting, TLS termination, autoscaling, and managed operations are deferred.
- Local setup and repeatability become important for reviewers and developers.

**Alternatives Considered**

- Single cloud app platform with managed PostgreSQL — Not selected because the user chose local/demo-only deployment.
- VPS/container host with self-managed database — Not selected because it adds hosting operations outside first-release scope.
- Hosting TBD — Not selected because local/demo-only scope was chosen.

### ARD-DEC-003 — Use a Monorepo with Separate Frontend and Backend Areas

- **Status:** Accepted
- **Related Requirements:** PRD-FR-009, PRD-NFR-001

**Decision**

Use a single monorepo with separate frontend and backend directories.

**Rationale**

A monorepo simplifies local demo coordination while preserving separation between React UI code and Express API/database code.

**Consequences**

- Shared project setup can coordinate frontend, backend, and database workflows.
- Repository path names are assumed until implementation initializes the repository structure.
- Cross-layer changes can be reviewed together.

**Alternatives Considered**

- Single full-stack project — Not selected because the user chose separate frontend and backend directories.
- Separate frontend and backend repositories — Not selected because it adds coordination overhead for a small demo.
- Repository structure TBD — Not selected because the monorepo decision was made.

### ARD-DEC-004 — Treat PostgreSQL as the Task System of Record

- **Status:** Accepted
- **Related Requirements:** PRD-FR-008, PRD-FR-009

**Decision**

PostgreSQL is the system of record for all task data in the first release.

**Rationale**

The PRD requires database-backed persistence so tasks remain available after refresh. PostgreSQL provides durable storage and supports straightforward task CRUD queries.

**Consequences**

- UI state must not be treated as authoritative after mutations.
- Backend writes must complete successfully before success is shown for persistent operations.
- Database setup and migrations are required for repeatable local demos.

**Alternatives Considered**

- Browser local storage — Not selected because the PRD requires a REST API and database.
- SQLite — Not selected because PostgreSQL was selected for the data layer.
- In-memory storage — Not selected because it would not satisfy persistence across refresh/restart scenarios.

### ARD-DEC-005 — Use Versioned Database Migrations and Local Seed/Reset Procedures

- **Status:** Accepted
- **Related Requirements:** PRD-FR-008

**Decision**

Database schema changes must be managed with versioned migrations and documented local seed/reset procedures.

**Rationale**

Versioned migrations make the local/demo database repeatable and reduce setup drift, while seed/reset procedures support consistent review and QA runs.

**Consequences**

- A migration tool or migration convention must be selected during implementation.
- Database schema changes are reviewable as part of source control.
- Local reset can destroy demo task data and must be clearly documented.

**Alternatives Considered**

- Manual table creation — Not selected because it is less repeatable.
- Auto-create tables on startup — Not selected because it hides schema changes and weakens reviewability.
- Database setup TBD — Not selected because migration approach was decided.

### ARD-DEC-006 — Keep REST Endpoint Paths TBD While Defining CRUD Capabilities

- **Status:** Accepted
- **Related Requirements:** PRD-FR-009, PRD-FR-010

**Decision**

The ARD defines REST API capabilities for task CRUD, completion, retrieval, and filtering, but exact endpoint paths remain TBD until implementation planning.

**Rationale**

The PRD requires REST API support but does not mandate path shape. The user selected capability-level definition over standardized endpoint paths.

**Consequences**

- Feature specifications or implementation planning must finalize concrete paths before development.
- Contract tests cannot be completed until paths are finalized.
- The ARD can still define required request/response data contracts and error behavior.

**Alternatives Considered**

- Resource REST with explicit paths — Not selected because endpoint paths were left TBD.
- Minimal REST with completion via full update — Not selected because exact path strategy was left TBD.
- RPC-style HTTP — Not selected because the PRD requires REST API behavior.

## 8. API and Integration Architecture

### ARD-API-001 — Task REST API

- **Type:** REST
- **Operation/Topic:** `Task CRUD, completion, retrieval, and status filtering; exact methods and paths TBD (see ARC-OQ-006)`
- **Provider:** COMP-002
- **Consumers:** COMP-001
- **Authentication:** None for first release; local/demo access only
- **Versioning:** TBD if API is externalized beyond local/demo scope (see ARC-OQ-006)

**Request/Input Contract**

Task create/update requests support the following fields:

- `title` — string; required by PRD-FR-002 for create and edit save operations.
- `description` — string; optional.
- `dueDate` — date or null; optional; may be blank and may be in the past.
- `priority` — enum: `Low`, `Medium`, `High`; optional per PRD assumption ASM-002.
- `status` — enum: `Pending`, `Completed`; system defaults new tasks to `Pending`.
- `statusFilter` — enum: `All`, `Pending`, `Completed`; used for task list filtering.
- `id` — task identifier for read/update/complete/delete operations; exact format TBD (see ARC-OQ-006).

**Response/Output Contract**

Successful responses return one of the following:

- A task record containing `id`, `title`, `description`, `dueDate`, `priority`, and `status`.
- A task list containing zero or more task records.
- A deletion result indicating the task no longer exists.

Error responses must provide enough information for COMP-001 to show a clear user-facing message and preserve the current screen/form context, as required by PRD-FR-010. Exact error response schema is TBD (see ARC-OQ-006).

**Error Handling**

- Validation failures must not create or update invalid task records.
- API or database failures must return an error response instead of causing an unhandled crash.
- COMP-001 must show a clear error message and keep the user on the current screen for create, edit, complete, and delete failures.
- Retry and idempotency rules are TBD until endpoint paths and mutation semantics are finalized (see ARC-OQ-006).

## 9. Data Architecture

### DATA-001 — Task

- **Purpose:** Represents a personal daily task managed through the application.
- **System of Record:** PostgreSQL database (COMP-004).
- **Classification:** Internal.
- **Retention:** Retained indefinitely until the user deletes the task or the local/demo database is reset.
- **Key Relationships:** No user relationship in first release; each task exists in the single local/shared workspace.

### Data Migration

- **Required:** No
- **Approach:** No migration is required for the first release because the PRD specifies no existing application or stored task dataset. Versioned schema migrations are required for database setup and future schema changes.

## 10. Security Architecture

### ARD-SEC-001 — Local/Demo No-Login Security Scope

- **Related Requirements:** PRD-FR-010, PRD-NFR-002

The implementation must:

- Keep first-release access local/demo-only unless a future architecture decision adds hosted deployment.
- Avoid adding user accounts, roles, task sharing, or SSO because those capabilities are out of scope for the approved PRD.
- Ensure API/database failures do not expose unnecessary implementation detail in user-facing messages.
- Preserve keyboard usability, visible labels, and readable contrast for task controls and forms.

The implementation must not:

- Implement login, user-account functionality, external identity provider integration, admin/member roles, or task assignment.
- Treat browser-only state as the durable task system of record.
- Expose task APIs as a public production service under the first-release local/demo scope.

### Security Controls

- **Authentication:** None for first release; local/demo access only.
- **Authorization:** None for first release; all tasks belong to a single local/shared workspace.
- **Secrets Management:** TBD (see ARC-OQ-007).
- **Encryption:** TBD for local/demo scope (see ARC-OQ-007).
- **Audit Logging:** TBD; no formal audit requirement is defined in the PRD (see ARC-OQ-007).
- **Dependency/CVE Scanning:** TBD (see ARC-OQ-008).
- **SBOM:** TBD (see ARC-OQ-008).

## 11. Reliability, Performance, and Scalability

### ARD-OPS-001 — Persistence Correctness

- **Target:** Created, edited, completed, and deleted task states remain correct after browser refresh for all Must-priority task flows.
- **Validation Method:** Manual QA checklist mapped to PRD-FR-008 acceptance criteria.

### ARD-OPS-002 — Error Containment

- **Target:** API and database failures in create, edit, complete, and delete flows show a user-facing error and keep the user on the current screen.
- **Validation Method:** Manual QA checklist and fault-injection or mocked API/database failure tests once testing strategy is finalized.

### ARD-OPS-003 — Performance Target

- **Target:** TBD because the approved PRD explicitly excludes explicit performance targets for the first release.
- **Validation Method:** TBD (see ARC-OQ-009).

### ARD-OPS-004 — Scalability Target

- **Target:** TBD because the first release is local/demo-only and no concurrent-user or dataset-size target is defined.
- **Validation Method:** TBD (see ARC-OQ-009).

## 12. Observability

- **Logging:** TBD (see ARC-OQ-010).
- **Metrics:** TBD (see ARC-OQ-010).
- **Tracing:** TBD (see ARC-OQ-010).
- **Alerting:** TBD (see ARC-OQ-010).
- **Sensitive Data Restrictions:** TBD (see ARC-OQ-007 and ARC-OQ-010).

## 13. Deployment Architecture

- **Environments:** Local/demo environment only for first release; additional environments TBD if hosting is added later.
- **Deployment Model:** Local/demo-only; exact local runtime orchestration is TBD (see ARC-OQ-011).
- **CI/CD:** TBD (see ARC-OQ-012).
- **Configuration Management:** TBD (see ARC-OQ-011 and ARC-OQ-007).
- **Rollback:** TBD (see ARC-OQ-011).
- **Infrastructure as Code:** Not required for hosted infrastructure in first release because no hosted production environment is in scope; local orchestration/IaC approach TBD (see ARC-OQ-011).

## 14. Testing Architecture

Required test levels:

- Unit tests
- Integration tests
- Contract tests
- End-to-end tests
- Security tests
- Performance tests, where applicable

Minimum quality expectations:

- **Coverage Threshold:** TBD (see ARC-OQ-013).
- **Blocking Security Severity:** TBD (see ARC-OQ-008).
- **Required Build/Lint Checks:** TBD (see ARC-OQ-013).

## 15. Architecture Constraints

- ARC-CON-001 — The company context is a small business.
- ARC-CON-002 — The first release must include a REST API and database.
- ARC-CON-003 — The selected first-release stack is React, Node.js/Express, and PostgreSQL.
- ARC-CON-004 — The first release must remain minimal and focused on the approved CRUD/demo scope.
- ARC-CON-005 — No fixed deadline or budget is set for the first release.
- ARC-CON-006 — No login, user-account functionality, task sharing, admin/member roles, manager assignment, reminders, notifications, subtasks, comments, or file attachments are included in the first release.
- ARC-CON-007 — The first release is local/demo-only with no hosted production environment.
- ARC-CON-008 — Task data is Internal and retained indefinitely until user deletion or local/demo database reset.
- ARC-CON-009 — Versioned database migrations and a documented local seed/reset procedure are required.
- ARC-CON-010 — Exact REST endpoint paths remain TBD; task CRUD, completion, retrieval, and filtering capabilities are required.

## 16. Risks and Trade-offs

| ID | Risk/Trade-off | Impact | Mitigation |
|---|---|---|---|
| ARC-RISK-001 | Endpoint paths are TBD while REST capabilities are defined | Delays API contract tests and frontend/backend integration details | Resolve ARC-OQ-006 before implementation of FEAT-002 |
| ARC-RISK-002 | Operations approach is TBD for local/demo deployment | Setup may be inconsistent across reviewers or developers | Resolve ARC-OQ-011 and document local setup before release QA |
| ARC-RISK-003 | Testing gates are TBD | Release confidence may depend too heavily on manual QA | Resolve ARC-OQ-013 before acceptance testing begins |
| ARC-RISK-004 | Security scanning, SBOM, and baseline controls are TBD | Required quality, security, and compliance outcomes may lack evidence | Resolve ARC-OQ-007 and ARC-OQ-008 before approval |
| ARC-RISK-005 | No hosted production environment | Application is suitable for local/demo review but not public production use | Keep hosted deployment out of first-release scope and revisit in a future ARD revision if needed |
| ARC-RISK-006 | No authentication or authorization | Any user with local access can view and modify all local/demo tasks | Keep deployment local/demo-only and do not expose APIs publicly |

## 17. Open Architecture Questions

| ID | Question | Owner | Status | Decision/Due Date |
|---|---|---|---|---|
| ARC-OQ-001 | Who is the Architecture Owner for ARD-TASKAPP? | Product Owner | Open | TBD |
| ARC-OQ-002 | Who are the ARD contributors? | Product Owner | Open | TBD |
| ARC-OQ-003 | What exact React, Node.js, Express, and PostgreSQL versions should be used? | Engineering Lead | Open | Before implementation |
| ARC-OQ-004 | What exact repository paths should be used for frontend, backend, migrations, and documentation? | Engineering Lead | Open | Before implementation |
| ARC-OQ-005 | How should validation be split between frontend and backend? | Engineering Lead | Open | Before implementation |
| ARC-OQ-006 | What exact REST endpoint paths, identifier format, error schema, retry rules, idempotency rules, and versioning strategy should be used? | Engineering Lead | Open | Before FEAT-002 implementation |
| ARC-OQ-007 | What baseline security controls should apply for secrets, encryption, audit logging, and sensitive data restrictions in the local/demo scope? | Security Reviewer | Open | Before approval |
| ARC-OQ-008 | What dependency/CVE scanning threshold and SBOM requirement should apply? | Security Reviewer | Open | Before approval |
| ARC-OQ-009 | Should any measurable performance or scalability target be added despite the PRD excluding explicit performance targets? | Product Owner | Open | TBD |
| ARC-OQ-010 | What observability requirements should apply for logging, metrics, tracing, and alerting in local/demo scope? | Engineering Lead | Open | Before release QA |
| ARC-OQ-011 | What exact local/demo operational approach should be used for runtime orchestration, configuration, rollback, and local infrastructure as code? | Engineering Lead | Open | Before release QA |
| ARC-OQ-012 | What CI/CD pipeline or local build automation should be required for first release? | Engineering Lead | Open | Before release QA |
| ARC-OQ-013 | What testing gates, coverage threshold, required build checks, and lint checks should block release? | Engineering Lead | Open | Before release QA |
| ARC-OQ-014 | What baseline should be recorded for PRD KPI-001 before release measurement begins? | Product Owner | Open | Before approval |

## 18. Feature Mapping

| Feature | Relevant Components | Decision IDs | Interface IDs | Security IDs |
|---|---|---|---|---|
| FEAT-001 | COMP-001, COMP-002 | ARD-DEC-001, ARD-DEC-003 | ARD-API-001 | ARD-SEC-001 |
| FEAT-002 | COMP-002, COMP-003 | ARD-DEC-001, ARD-DEC-006 | ARD-API-001 | ARD-SEC-001 |
| FEAT-003 | COMP-003, COMP-004, COMP-005 | ARD-DEC-004, ARD-DEC-005 | ARD-API-001 | ARD-SEC-001 |
| FEAT-004 | COMP-001, COMP-002, COMP-003 | ARD-DEC-006 | ARD-API-001 | ARD-SEC-001 |

## 19. Approval

| Role | Name | Decision | Date |
|---|---|---|---|
| Solution Architect | TBD | Pending | TBD |
| Security Reviewer | TBD | Pending | TBD |
| Engineering Lead | TBD | Pending | TBD |