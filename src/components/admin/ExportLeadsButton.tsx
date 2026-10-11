"use client";

import { useState, useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportLeadsCsv } from "@/app/actions/admin";

export function ExportLeadsButton() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    setError(null);
    start(async () => {
      const res = await exportLeadsCsv();
      if (!res.ok || !res.csv) {
        setError(res.message);
        return;
      }
      const blob = new Blob([`\uFEFF${res.csv}`], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gorealtors-leads-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className="btn btn-outline btn-sm"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2.4} />
        ) : (
          <Download className="h-4 w-4" strokeWidth={2.3} />
        )}
        Export CSV
      </button>
      {error && (
        <span className="mt-1 max-w-xs text-right text-[0.6875rem] text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}
