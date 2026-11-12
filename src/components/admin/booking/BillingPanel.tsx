"use client";

import { Check, Minus, Plus, Receipt, Trash2 } from "lucide-react";
import type { AdminBooking } from "@/types/admin";

/** Billing totals always carry two decimals (₹4,000.00). */
const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export type AdjustmentType = "add" | "subtract";

export interface InvoiceAdjustment {
  id: string;
  label: string;
  amount: string;
  type: AdjustmentType;
}

interface BillingPanelProps {
  booking: AdminBooking;
  amountDraft: string;
  onAmountDraftChange: (value: string) => void;
  amountError: string | null;
  isSavingAmount: boolean;
  adjustments: InvoiceAdjustment[];
  onAddAdjustment: () => void;
  onUpdateAdjustment: (id: string, patch: Partial<InvoiceAdjustment>) => void;
  onRemoveAdjustment: (id: string) => void;
  onSaveAmount: () => void;
  isPaid: boolean;
  balance: number;
  isUpdatingPayment: boolean;
  onTogglePayment: () => void;
}

/* ── Micro pieces ─────────────────────────────────────────────── */

function MicroLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#93A39B]">
      {children}
    </p>
  );
}

/**
 * Billing panel — minimal, premium layout: base amount, live totals,
 * balance due, adjustments and the mark-as-paid action.
 */
export default function BillingPanel({
  booking,
  amountDraft,
  onAmountDraftChange,
  amountError,
  isSavingAmount,
  adjustments,
  onAddAdjustment,
  onUpdateAdjustment,
  onRemoveAdjustment,
  onSaveAmount,
  isPaid,
  balance,
  isUpdatingPayment,
  onTogglePayment,
}: BillingPanelProps) {
  const hasAmount = booking.amount !== null;

  return (
    <section className="rounded-2xl border border-[#E3E8E5] bg-white">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-7 sm:py-5">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#E3E8E5] text-[#0F6B54]">
            <Receipt className="h-[15px] w-[15px]" strokeWidth={1.8} />
          </span>
          <div>
            <h2 className="text-[14.5px] font-semibold leading-tight tracking-[-0.01em] text-[#12201B]">
              Billing
            </h2>
            <p className="text-[11.5px] text-[#93A39B]">Amount, adjustments & payment status</p>
          </div>
        </div>

        {hasAmount && (
          <span
            className={`inline-flex items-center gap-2 text-[10.5px] font-semibold uppercase tracking-[0.14em] ${
              isPaid ? "text-[#0F6B54]" : "text-[#92580A]"
            }`}
          >
            <span
              aria-hidden="true"
              className={`h-1.5 w-1.5 rounded-full ${
                isPaid ? "bg-[#0F6B54]" : "bg-[#EAB308]"
              }`}
            />
            {isPaid ? "Paid" : "Unpaid"}
          </span>
        )}
      </div>

      <div className="space-y-7 px-5 pb-6 sm:px-7">
        {/* ── Base amount ──────────────────────────────────────── */}
        <form
          onSubmit={(event) => {
            event.preventDefault();
            onSaveAmount();
          }}
        >
          <div className="flex items-baseline justify-between">
            <MicroLabel>Base amount</MicroLabel>
            {hasAmount && (
              <span className="text-[11px] tabular-nums text-[#93A39B]">
                Saved {formatAmount(booking.amount ?? 0)}
              </span>
            )}
          </div>

          <div
            className={`mt-2.5 flex items-center gap-2 border-b pb-2.5 transition-colors ${
              amountError
                ? "border-red-300 focus-within:border-red-400"
                : "border-[#E3E8E5] focus-within:border-[#12201B]"
            }`}
          >
            <span
              aria-hidden="true"
              className="pl-0.5 text-[17px] font-medium text-[#93A39B]"
            >
              ₹
            </span>
            <input
              id="booking-amount"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={amountDraft}
              onChange={(event) => onAmountDraftChange(event.target.value)}
              placeholder="0.00"
              aria-invalid={Boolean(amountError)}
              aria-describedby={amountError ? "booking-amount-error" : undefined}
              className="h-9 w-full min-w-0 border-0 bg-transparent text-[22px] font-semibold tracking-[-0.01em] tabular-nums text-[#12201B] placeholder:font-normal placeholder:text-[#C6CEC9] focus:outline-none"
            />

            <button
              type="submit"
              disabled={isSavingAmount}
              className="ml-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-[#12201B] px-4 text-[12.5px] font-medium text-white transition-colors hover:bg-[#0F6B54] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSavingAmount ? (
                <span
                  aria-hidden="true"
                  className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-white/30 border-t-white"
                />
              ) : (
                <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              )}
              {isSavingAmount ? "Saving" : "Save"}
            </button>
          </div>

          {amountError && (
            <p
              id="booking-amount-error"
              role="alert"
              className="mt-1.5 text-[11.5px] font-medium text-red-600"
            >
              {amountError}
            </p>
          )}
        </form>

        {/* ── Statement ────────────────────────────────────────── */}
        {hasAmount ? (
          <div className="space-y-5">
            <dl>
              {/* Base amount row */}
              <div className="flex items-baseline justify-between gap-3 py-2.5">
                <dt className="text-[12.5px] text-[#5D6B65]">Base amount</dt>
                <dd className="text-[14.5px] font-semibold tabular-nums tracking-[-0.01em] text-[#12201B]">
                  {formatAmount(booking.amount ?? 0)}
                </dd>
              </div>

              {/* Adjustments rows */}
              {adjustments.map((adjustment) => {
                const value = parseFloat(adjustment.amount) || 0;
                if (value === 0) return null;
                const isAddition = adjustment.type === "add";
                return (
                  <div
                    key={adjustment.id}
                    className="flex items-baseline justify-between gap-3 py-2.5"
                  >
                    <dt className="truncate text-[12.5px] text-[#5D6B65]">
                      <span
                        aria-hidden="true"
                        className={`mr-1.5 font-semibold ${
                          isAddition ? "text-[#0F6B54]" : "text-red-600"
                        }`}
                      >
                        {isAddition ? "+" : "−"}
                      </span>
                      {adjustment.label.trim() || (isAddition ? "Extra charges" : "Deduction")}
                    </dt>
                    <dd
                      className={`text-[14.5px] font-semibold tabular-nums tracking-[-0.01em] ${
                        isAddition ? "text-[#0F6B54]" : "text-red-600"
                      }`}
                    >
                      {formatAmount(value)}
                    </dd>
                  </div>
                );
              })}

              {/* Hairline divider then paid row */}
              <div className="border-t border-[#E3E8E5]">
                <div className="flex items-baseline justify-between gap-3 pt-3">
                  <dt className="text-[12.5px] font-medium text-[#12201B]">Paid</dt>
                  <dd
                    className={`text-[14.5px] font-semibold tabular-nums tracking-[-0.01em] ${
                      isPaid ? "text-[#0F6B54]" : "text-[#93A39B]"
                    }`}
                  >
                    {formatAmount(isPaid ? booking.amount ?? 0 : 0)}
                  </dd>
                </div>
              </div>
            </dl>

            {/* Balance — quiet statement line, no colored block */}
            <div className="flex items-baseline justify-between gap-3 border-t border-[#12201B]/10 pt-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#93A39B]">
                  {isPaid ? "Balance" : "Balance due"}
                </p>
                <p className="mt-1 text-[11.5px] text-[#93A39B]">
                  {isPaid ? "Paid in full — nothing outstanding." : "Outstanding on this booking."}
                </p>
              </div>
              <p
                className={`text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums ${
                  isPaid ? "text-[#0F6B54]" : "text-[#12201B]"
                }`}
              >
                {formatAmount(balance)}
              </p>
            </div>
          </div>
        ) : (
          <p className="border-t border-dashed border-[#E3E8E5] pt-4 text-[12px] leading-relaxed text-[#93A39B]">
            No amount set yet. Enter a base amount and save it to enable payment and invoicing.
          </p>
        )}

        {/* ── Adjustments ──────────────────────────────────────── */}
        <div className="border-t border-[#E3E8E5] pt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-3">
              <MicroLabel>Adjustments</MicroLabel>
              <span className="text-[11px] text-[#C6CEC9]">invoice only</span>
            </div>
            <button
              type="button"
              onClick={onAddAdjustment}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#E3E8E5] px-3.5 py-1.5 text-[12px] font-medium text-[#12201B] transition-colors hover:border-[#12201B]"
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
              Add
            </button>
          </div>

          {adjustments.length > 0 ? (
            <ul className="mt-1 divide-y divide-[#E3E8E5]/70">
              {adjustments.map((adjustment, index) => {
                const isAddition = adjustment.type === "add";
                return (
                  <li key={adjustment.id} className="flex items-center gap-2.5 py-3">
                    <span
                      aria-hidden="true"
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[#12201B] ${
                        isAddition ? "border-[#0F6B54]/30 text-[#0F6B54]" : "border-red-200 text-red-600"
                      }`}
                    >
                      {isAddition ? <Plus className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
                    </span>

                    <input
                      type="text"
                      value={adjustment.label}
                      onChange={(event) =>
                        onUpdateAdjustment(adjustment.id, { label: event.target.value })
                      }
                      placeholder={`Adjustment ${index + 1} description`}
                      aria-label={`Description for adjustment ${index + 1}`}
                      className="h-8 min-w-0 flex-1 basis-32 border-0 border-b border-transparent bg-transparent px-0.5 text-[12.5px] text-[#12201B] transition-colors placeholder:text-[#C6CEC9] focus:border-[#12201B]/30 focus:outline-none"
                    />

                    {/* Add / deduct toggle — quiet segmented text */}
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onUpdateAdjustment(adjustment.id, { type: "add" })}
                        aria-pressed={isAddition}
                        className={`rounded-full px-2 py-1 text-[10.5px] font-semibold transition-colors ${
                          isAddition
                            ? "bg-[#0F6B54]/10 text-[#0F6B54]"
                            : "text-[#93A39B] hover:text-[#12201B]"
                        }`}
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdateAdjustment(adjustment.id, { type: "subtract" })}
                        aria-pressed={!isAddition}
                        className={`rounded-full px-2 py-1 text-[10.5px] font-semibold transition-colors ${
                          !isAddition
                            ? "bg-red-50 text-red-600"
                            : "text-[#93A39B] hover:text-[#12201B]"
                        }`}
                      >
                        Deduct
                      </button>
                    </div>

                    <div className="relative w-24 shrink-0">
                      <span className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-[11px] font-medium text-[#93A39B]">
                        ₹
                      </span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={adjustment.amount}
                        onChange={(event) =>
                          onUpdateAdjustment(adjustment.id, { amount: event.target.value })
                        }
                        placeholder="0.00"
                        aria-label={`Amount for adjustment ${index + 1}`}
                        className="h-8 w-full rounded-lg border border-transparent bg-[#F8FAF9] pl-5 pr-2 text-right font-mono text-[12px] font-medium tabular-nums text-[#12201B] placeholder:text-[#C6CEC9] focus:border-[#12201B]/25 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => onRemoveAdjustment(adjustment.id)}
                      aria-label={`Remove adjustment ${index + 1}`}
                      className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[#C6CEC9] transition-colors hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-[11.5px] text-[#C6CEC9]">
              No adjustments yet — extra charges or deductions will appear on the invoice.
            </p>
          )}
        </div>

        {/* ── Mark as paid ─────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-3 border-t border-[#E3E8E5] pt-4">
          {!isPaid ? (
            <>
              <p className="text-[11.5px] text-[#93A39B]">Confirms full payment for this booking</p>
              <button
                type="button"
                disabled={!hasAmount || isUpdatingPayment}
                onClick={onTogglePayment}
                className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-full border border-[#12201B]/15 bg-[#12201B] px-5 py-2.5 text-[12.5px] font-medium text-white transition-colors hover:bg-[#0F6B54] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isUpdatingPayment ? (
                  <span
                    aria-hidden="true"
                    className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-white/30 border-t-white"
                  />
                ) : (
                  <Check className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                )}
                {isUpdatingPayment ? "Updating" : "Mark as paid"}
              </button>
            </>
          ) : (
            <div className="flex w-full items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 text-[12.5px] font-medium text-[#0F6B54]">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#0F6B54]/10">
                  <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
                </span>
                Payment recorded
              </span>
              <button
                type="button"
                disabled={isUpdatingPayment}
                onClick={onTogglePayment}
                className="text-[11.5px] font-medium text-[#93A39B] underline-offset-4 transition-colors hover:text-[#12201B] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isUpdatingPayment ? "Updating" : "Undo"}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
