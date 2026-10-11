"use client";

import { useMemo, useState } from "react";
import { Info } from "lucide-react";
import { calcEmi, formatINR } from "@/lib/utils";

const fmt = (n: number) =>
  `₹${Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

export function EmiCalculator() {
  const [price, setPrice] = useState(40000000);
  const [downPct, setDownPct] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const result = useMemo(() => {
    const down = (price * downPct) / 100;
    const loan = Math.max(price - down, 0);
    const emi = loan > 0 ? calcEmi(loan, rate, years) : 0;
    const total = emi * years * 12;
    const interest = Math.max(total - loan, 0);

    // Haryana-style acquisition costs, indicative
    const gst = price * 0.05;
    const stampDuty = price * 0.07;
    const registration = Math.min(price * 0.005, 50000);
    const allIn = price + gst + stampDuty + registration;

    return {
      down,
      loan,
      emi,
      total,
      interest,
      gst,
      stampDuty,
      registration,
      allIn,
      principalShare: loan > 0 ? (loan / (loan + interest)) * 100 : 0,
    };
  }, [price, downPct, rate, years]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
      {/* ---- inputs ---- */}
      <div className="card p-6 lg:p-7">
        <h2 className="font-display text-[1.125rem] font-bold">
          Your numbers
        </h2>

        <div className="mt-7 space-y-8">
          <Slider
            id="emi-price"
            label="Property price"
            value={price}
            display={formatINR(price)}
            min={5000000}
            max={300000000}
            step={500000}
            onChange={setPrice}
            hint="Base price quoted by the developer"
          />
          <Slider
            id="emi-down"
            label="Down payment"
            value={downPct}
            display={`${downPct}% · ${formatINR(result.down)}`}
            min={10}
            max={80}
            step={1}
            onChange={setDownPct}
            hint="Banks typically fund up to 75-80% of the agreement value"
          />
          <Slider
            id="emi-rate"
            label="Interest rate"
            value={rate}
            display={`${rate.toFixed(2)}% p.a.`}
            min={7}
            max={14}
            step={0.05}
            onChange={setRate}
            hint="Current floating home-loan rates generally sit between 8.2% and 9.5%"
          />
          <Slider
            id="emi-years"
            label="Loan tenure"
            value={years}
            display={`${years} years`}
            min={5}
            max={30}
            step={1}
            onChange={setYears}
            hint="Longer tenure lowers the EMI but increases total interest paid"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2 border-t border-ink-100 pt-5">
          <span className="self-center text-[0.75rem] font-semibold text-ink-400">
            Quick set
          </span>
          {[
            { label: "₹1.5 Cr", v: 15000000 },
            { label: "₹3 Cr", v: 30000000 },
            { label: "₹5 Cr", v: 50000000 },
            { label: "₹10 Cr", v: 100000000 },
          ].map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setPrice(p.v)}
              className={price === p.v ? "chip chip-active" : "chip"}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- results ---- */}
      <div>
        <div className="rounded-md bg-ink-950 p-6 lg:p-7">
          <p className="text-[0.625rem] font-bold uppercase tracking-[0.14em] text-brand-400">
            Monthly EMI
          </p>
          <p className="mt-2 font-display text-[2.5rem] font-extrabold leading-none text-white lg:text-[3rem]">
            {fmt(result.emi)}
          </p>
          <p className="mt-2 text-[0.8125rem] text-white/50">
            for {years} years at {rate.toFixed(2)}% p.a.
          </p>

          {/* split bar */}
          <div className="mt-7">
            <div className="flex h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="bg-brand-500"
                style={{ width: `${result.principalShare}%` }}
              />
              <div
                className="bg-amber-500"
                style={{ width: `${100 - result.principalShare}%` }}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-[0.75rem]">
              <span className="inline-flex items-center gap-1.5 text-white/70">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                Principal {fmt(result.loan)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-white/70">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Interest {fmt(result.interest)}
              </span>
            </div>
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/12 pt-6">
            {[
              ["Loan amount", fmt(result.loan)],
              ["Down payment", fmt(result.down)],
              ["Total interest", fmt(result.interest)],
              ["Total repayment", fmt(result.total)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.625rem] font-bold uppercase tracking-wider text-white/40">
                  {k}
                </dt>
                <dd className="mt-1 font-display text-[1.0625rem] font-bold text-white">
                  {v}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* acquisition cost */}
        <div className="card mt-5 p-6">
          <h3 className="font-display text-[1rem] font-bold">
            Indicative total acquisition cost
          </h3>
          <p className="mt-1.5 text-[0.75rem] leading-relaxed text-ink-500">
            Beyond the quoted price, a Gurugram purchase typically carries these
            statutory and transaction costs.
          </p>
          <dl className="mt-4 divide-y divide-ink-100 text-[0.875rem]">
            {[
              ["Base price", fmt(price)],
              ["GST @ 5% (under-construction)", fmt(result.gst)],
              ["Stamp duty @ 7% (Haryana, male buyer)", fmt(result.stampDuty)],
              ["Registration charges", fmt(result.registration)],
            ].map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                <dt className="text-ink-600">{k}</dt>
                <dd className="shrink-0 font-semibold tabular-nums text-ink-900">
                  {v}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between gap-4 py-3">
              <dt className="font-bold text-ink-950">Approximate all-in</dt>
              <dd className="shrink-0 font-display text-[1.125rem] font-extrabold tabular-nums text-brand-800">
                {fmt(result.allIn)}
              </dd>
            </div>
          </dl>
          <p className="mt-3 flex items-start gap-2 rounded-sm bg-ink-50 p-3 text-[0.6875rem] leading-relaxed text-ink-500">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" strokeWidth={2.3} />
            Indicative only. Stamp duty in Haryana is 5% for female buyers and
            6% for joint ownership. GST is not applicable on ready-to-move
            property with an occupation certificate. Club membership,
            infrastructure development charges, power backup, parking and
            advance maintenance are project-specific and not included above. We
            itemise the actual figures for any project on request.
          </p>
        </div>
      </div>
    </div>
  );
}

function Slider({
  id,
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.8125rem] font-semibold text-ink-700">
          {label}
        </label>
        <span className="font-display text-[0.9375rem] font-bold text-ink-950">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-ink-200 accent-brand-600"
        style={{
          background: `linear-gradient(to right, var(--color-brand-600) 0%, var(--color-brand-600) ${
            ((value - min) / (max - min)) * 100
          }%, var(--color-ink-200) ${
            ((value - min) / (max - min)) * 100
          }%, var(--color-ink-200) 100%)`,
        }}
      />
      {hint && (
        <p className="mt-2 text-[0.6875rem] leading-relaxed text-ink-400">
          {hint}
        </p>
      )}
    </div>
  );
}
