"use client";

import { useEffect, useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { SITE, WHATSAPP_LINK } from "@/lib/site";

/** Mobile action bar + desktop floating WhatsApp button. */
export function StickyCta({ context }: { context?: string }) {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const msg = context
    ? `Hi GoRealtors, I'd like details on ${context}.`
    : "Hi GoRealtors, I'd like to discuss a property in Gurugram.";

  return (
    <>
      {/* mobile bar */}
      {!dismissed && (
        <div
          className={`fixed inset-x-0 bottom-0 z-40 border-t border-ink-200 bg-white/97 backdrop-blur transition-transform duration-300 lg:hidden ${
            show ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="flex items-center gap-2 px-3 py-2.5">
            <a href={`tel:${SITE.phone}`} className="btn btn-outline flex-1">
              <Phone className="h-4 w-4" strokeWidth={2.3} />
              Call
            </a>
            <a
              href={WHATSAPP_LINK(msg)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary flex-1"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.3} />
              WhatsApp
            </a>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss contact bar"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink-200 text-ink-500"
            >
              <X className="h-4 w-4" strokeWidth={2.3} />
            </button>
          </div>
        </div>
      )}

      {/* desktop floating */}
      <a
        href={WHATSAPP_LINK(msg)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className={`group fixed bottom-6 right-6 z-40 hidden items-center gap-2.5 rounded-full bg-[#25D366] py-3 pl-3.5 pr-4 text-white shadow-rise transition-all duration-300 hover:bg-[#1da851] lg:inline-flex ${
          show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <MessageCircle className="h-5 w-5" strokeWidth={2.3} />
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-[0.8125rem] font-bold transition-all duration-300 group-hover:max-w-[9rem]">
          Chat with us
        </span>
      </a>
    </>
  );
}
