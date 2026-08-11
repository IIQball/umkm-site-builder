# PRD — User Journeys

Status: TODO

End-to-end flows. Where a user story says what someone wants, a journey says every screen
and state they pass through to get it — including the ones that go wrong.

---

## Journey — <name>

**Persona:** <who>
**Trigger:** <what starts it>
**Success state:** <where it ends when it goes right>

### Happy path

| # | Screen / route | User does | System does | State shown |
|---|---|---|---|---|
| 1 | | | | |

### Failure and edge paths

| Where | What goes wrong | What the user sees | Recovery |
|---|---|---|---|
| | invalid input | field-level message | fix and retry |
| | not authorized | <denied behaviour per G5> | |
| | network or server error | toast, generic message | retry |
| | empty state (no data yet) | empty state with next action | |
| | slow response | loading state | |

### Drop-off risks

<Where a real user gives up, and what reduces that.>

---

Every journey must list its failure paths. A journey with only a happy path produces a UI
with only a happy state.
