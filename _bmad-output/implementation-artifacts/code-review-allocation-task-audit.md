# Code Review: AllocationInterface, TaskManagement, audit.ts

**Date:** 2026-06-29  
**Reviewer:** bmad-code-review workflow  
**Scope:** Post-update review of `components/features/AllocationInterface.tsx`, `components/features/TaskManagement.tsx`, `lib/audit.ts`  
**Mode:** no-spec (targeted file review + `tsc --noEmit` + IDE Problems panel)

---

## Summary

| Bucket | Count |
|--------|-------|
| **patch** (syntax / type errors — blocking compile) | 5 |
| **patch** (logic / robustness) | 4 |
| **defer** (style / pre-existing patterns) | 2 |
| **dismiss** | 0 |

**Verdict:** 5 TypeScript errors block a clean build. All have unambiguous fixes below.

---

## Problems Panel / `tsc` Findings (Syntax)

### [Patch] F1 — `lib/audit.ts:19` — Invalid async return type

**Error:** `TS1064: The return type of an async function or method must be the global Promise<T> type`

**Cause:** `verifyIntegrity()` is marked `async` but returns a plain object synchronously. TypeScript requires `Promise<{...}>` for async methods.

**Resolution (preferred):** Remove `async` — the method has no `await`:

```typescript
static verifyIntegrity(): { valid: boolean; brokenAt?: number } {
```

**Alternative:** Keep `async` and annotate `Promise<{ valid: boolean; brokenAt?: number }>`.

---

### [Patch] F2 — `AllocationInterface.tsx:56` — Validation state type mismatch

**Error:** `TS2345: Argument of type '{ valid: boolean; error: string; percentage: number; } | { valid: boolean; percentage: number; error?: undefined; }' is not assignable to SetStateAction<...>`

**Cause:** State declares `error: string` as required, but `validateAllocation()` returns `{ valid: true, percentage }` without `error` on success.

**Resolution:** Widen state type:

```typescript
type ValidationResult = {
  valid: boolean;
  percentage: number;
  error?: string;
};
const [validation, setValidation] = useState<ValidationResult | null>(null);
```

Guard reads with optional chaining: `validation.error?.includes('Capacity Exceeded')`.

---

### [Patch] F3 — `AllocationInterface.tsx:174` — `disabled` prop type `boolean | null`

**Error:** `TS2322: Type 'boolean | null' is not assignable to type 'boolean | undefined'`

**Cause:** Expression `(validation && !validation.valid)` evaluates to `null` when `validation` is `null` (short-circuit returns `null`, not `false`).

**Resolution:**

```typescript
disabled={!selectedTask || !selectedSpecialist || (validation !== null && !validation.valid)}
```

---

### [Patch] F4 — `TaskManagement.tsx:163,192,217` — `Button` missing `type` prop

**Error:** `TS2322: Type '{ children: string; type: string; ... }' is not assignable to type 'IntrinsicAttributes & ButtonProps'`

**Cause:** Form submit buttons pass `type="submit"` but `components/ui/Button.tsx` does not forward `type` to the native `<button>`.

**Resolution:** Extend `ButtonProps`:

```typescript
type?: 'button' | 'submit' | 'reset';
// ...
<button type={type ?? 'button'} ...>
```

Default `button` for non-form usage; forms keep `type="submit"`.

---

### [Patch] F5 — `AllocationInterface.tsx:9` — Unused import

**Warning:** `AllocationRequest` imported but never used.

**Resolution:** Remove unused import.

---

## Logical / Robustness Findings

### [Patch] F6 — `AllocationInterface` — Uncaught errors in capacity `useEffect`

**Issue:** `validateAllocation()` throws (`Specialist not found`, `Specialist is currently inactive`). The `useEffect` has no `try/catch`, so failures become unhandled promise rejections.

**Resolution:**

```typescript
try {
  const result = await validateAllocation({ ... });
  setValidation(result);
} catch (err: unknown) {
  setValidation({
    valid: false,
    percentage: 0,
    error: err instanceof Error ? err.message : 'Validation failed',
  });
}
```

---

### [Patch] F7 — `AllocationInterface` — Override path re-validates without override context

**Issue:** `handleSave(overrideData)` calls `allocateTask(..., overrideData)` which re-runs `validateAllocation` internally. Works today, but `allocateTask` throws if `validation.error` is undefined on invalid path (recovery-floor edge). Low risk with current seed data.

**Resolution:** No code change required now; document that override flow depends on `engine.ts` returning `error` on all `valid: false` paths (already true).

---

### [Patch] F8 — `TaskManagement` — `catch (err: any)` loses type safety

**Issue:** Three handlers use `err: any`. Not a compile error but violates strict patterns and can hide non-Error throws.

**Resolution:**

```typescript
} catch (err: unknown) {
  setError(err instanceof Error ? err.message : 'Operation failed');
}
```

---

### [Patch] F9 — `TaskManagement` — Empty date strings sent to server

**Issue:** `formData.get('startDate') as string` returns `""` when unset. Server stores empty string instead of `null`, which can break slippage SQL comparisons.

**Resolution:** Normalize before submit:

```typescript
startDate: (formData.get('startDate') as string) || undefined,
endDate: (formData.get('endDate') as string) || undefined,
```

---

### [Defer] F10 — `AllocationInterface` — Error message truncated for E2E

**Issue:** UI shows `"Capacity Exceeded"` instead of full `validation.error` percentage string. Intentional for Playwright `text=Capacity Exceeded` but reduces operator detail.

**Resolution:** Defer — show full message in UI, use `data-testid` in tests later.

---

### [Defer] F11 — `audit.ts` — Default `AUDIT_SECRET`

**Issue:** Falls back to `'default-secret'` when env unset. Pre-existing security note, not introduced by recent UI work.

**Resolution:** Defer — set `AUDIT_SECRET` in production `.env`.

---

## Fix Application Order

1. `lib/audit.ts` — remove `async` from `verifyIntegrity`
2. `components/ui/Button.tsx` — add `type` prop
3. `components/features/AllocationInterface.tsx` — validation type, disabled expr, try/catch, remove unused import
4. `components/features/TaskManagement.tsx` — `unknown` catches, optional dates

After fixes, verify:

```bash
npx tsc --noEmit
```

---

## Review Findings Checklist

- [x] [Review][Patch] F1 audit async return type [`lib/audit.ts:19`]
- [x] [Review][Patch] F2 validation state type [`AllocationInterface.tsx:16,56`]
- [x] [Review][Patch] F3 disabled boolean|null [`AllocationInterface.tsx:174`]
- [x] [Review][Patch] F4 Button type prop [`TaskManagement.tsx:163,192,217`]
- [x] [Review][Patch] F5 unused import [`AllocationInterface.tsx:9`]
- [x] [Review][Patch] F6 uncaught validateAllocation [`AllocationInterface.tsx:31-58`]
- [x] [Review][Patch] F8 err:any catches [`TaskManagement.tsx:40,61,77`]
- [x] [Review][Patch] F9 empty date strings [`TaskManagement.tsx:29-34`]
- [x] [Review][Defer] F10 truncated capacity message
- [x] [Review][Defer] F11 default audit secret
