"use client";

import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { contactSchema } from "@/lib/contact-schema";
import { STAGGER, cappedStagger, SPRING_SOFT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

type Status = "idle" | "submitting" | "success" | "error";

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm({ email }: { email: string }) {
  const { reduced } = useReducedMotionSafe();
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      topic: (form.get("topic") as string) || undefined,
      message: String(form.get("message") ?? ""),
      company: String(form.get("company") ?? ""),
    };

    const parsed = contactSchema.safeParse(raw);
    if (!parsed.success) {
      const next: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!next[key]) next[key] = issue.message;
      }
      setErrors(next);
      // Move focus to the first invalid field.
      if (next.name) nameRef.current?.focus();
      else if (next.email) emailRef.current?.focus();
      else if (next.message) messageRef.current?.focus();
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("success");
      } else {
        setServerError(data.error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setServerError("The network request failed.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex flex-col items-start gap-4 rounded-lg border border-success/40 bg-success/10 p-6"
        role="status"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-8 text-success" aria-hidden="true">
          <motion.path
            d="M4 12.5 9.5 18 20 6.5"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduced ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4 }}
          />
        </svg>
        <p className="font-mono text-sm text-fg">
          Message sent. Thanks for reaching out; expect a reply at the address you gave.
        </p>
      </div>
    );
  }

  const fields = [
    <div key="name" className="flex flex-col gap-1.5">
      <label htmlFor="contact-name" className="font-mono text-xs uppercase tracking-wider text-fg-muted">
        Name <span aria-hidden="true" className="text-danger">*</span>
        <span className="sr-only">(required)</span>
      </label>
      <Input
        ref={nameRef}
        id="contact-name"
        name="name"
        autoComplete="name"
        required
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "contact-name-error" : undefined}
        className="h-11 text-base"
      />
      {errors.name ? (
        <p id="contact-name-error" className="text-xs text-danger">
          {errors.name}
        </p>
      ) : null}
    </div>,
    <div key="email" className="flex flex-col gap-1.5">
      <label htmlFor="contact-email" className="font-mono text-xs uppercase tracking-wider text-fg-muted">
        Email <span aria-hidden="true" className="text-danger">*</span>
        <span className="sr-only">(required)</span>
      </label>
      <Input
        ref={emailRef}
        id="contact-email"
        name="email"
        type="email"
        autoComplete="email"
        required
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "contact-email-error" : undefined}
        className="h-11 text-base"
      />
      {errors.email ? (
        <p id="contact-email-error" className="text-xs text-danger">
          {errors.email}
        </p>
      ) : null}
    </div>,
    <div key="topic" className="flex flex-col gap-1.5">
      <label htmlFor="contact-topic" className="font-mono text-xs uppercase tracking-wider text-fg-muted">
        What is this about
      </label>
      <select
        id="contact-topic"
        name="topic"
        defaultValue=""
        className="h-11 rounded-md border border-border bg-bg-elevated px-3 text-base text-fg"
      >
        <option value="">Choose one (optional)</option>
        <option value="internship">Internship opportunity</option>
        <option value="project">Project</option>
        <option value="question">Question</option>
        <option value="other">Other</option>
      </select>
    </div>,
    <div key="message" className="flex flex-col gap-1.5">
      <label htmlFor="contact-message" className="font-mono text-xs uppercase tracking-wider text-fg-muted">
        Message <span aria-hidden="true" className="text-danger">*</span>
        <span className="sr-only">(required)</span>
      </label>
      <Textarea
        ref={messageRef}
        id="contact-message"
        name="message"
        rows={5}
        required
        aria-invalid={!!errors.message}
        aria-describedby={errors.message ? "contact-message-error" : undefined}
        className="text-base"
      />
      {errors.message ? (
        <p id="contact-message-error" className="text-xs text-danger">
          {errors.message}
        </p>
      ) : null}
    </div>,
  ];

  return (
    <form onSubmit={onSubmit} noValidate className="flex max-w-xl flex-col gap-5">
      {/* Honeypot: visually hidden, ignored by humans, filled by bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="contact-company">Company</label>
        <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <motion.div
        initial={reduced ? false : "hidden"}
        whileInView={reduced ? undefined : "visible"}
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: cappedStagger(fields.length, STAGGER.base) } },
        }}
        className="flex flex-col gap-5"
      >
        {fields.map((field, i) => (
          <motion.div
            key={i}
            data-reveal
            variants={{
              hidden: { opacity: 0, y: 12 },
              visible: { opacity: 1, y: 0, transition: SPRING_SOFT },
            }}
          >
            {field}
          </motion.div>
        ))}
      </motion.div>

      <div aria-live="polite" className="flex flex-col gap-3">
        {status === "error" ? (
          <p className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-fg">
            {serverError}{" "}
            <a href={`mailto:${email}`} className="text-accent underline underline-offset-4">
              Email {email} directly
            </a>{" "}
            so the message is never lost.
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={status === "submitting"} className="w-fit">
        {status === "submitting" ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Sending
          </>
        ) : (
          "Send message"
        )}
      </Button>
    </form>
  );
}
