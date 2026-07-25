"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { SPRING_SOFT, DURATION, EASE_OUT } from "@/lib/motion";
import { useReducedMotionSafe } from "@/components/motion/useReducedMotionSafe";

interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

/**
 * Gallery with a shared-element lightbox (layoutId from thumbnail to
 * lightbox). Escape closes, arrows navigate, focus is trapped and restored
 * to the triggering thumbnail. Under reduced motion the lightbox opens with
 * a plain fade.
 */
export function CaseStudyGallery({ images }: { images: GalleryImage[] }) {
  const { reduced } = useReducedMotionSafe();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
      if (e.key === "Tab") {
        // Single focusable control inside: keep focus on the close button.
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, images.length, close]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((img, i) => (
          <motion.button
            key={img.src}
            ref={openIndex === i ? triggerRef : undefined}
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            initial={reduced ? false : { opacity: 0, scale: 0.98 }}
            whileInView={reduced ? undefined : { opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={SPRING_SOFT}
            data-reveal
            layoutId={reduced ? undefined : `gallery-${img.src}`}
            className="overflow-hidden rounded-md border border-border"
            aria-label={`Open image: ${img.alt}`}
          >
            <Image src={img.src} alt={img.alt} width={1200} height={800} className="h-auto w-full" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {openIndex !== null ? (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={images[openIndex]?.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.base, ease: EASE_OUT }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-bg/90 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <button
              ref={closeRef}
              onClick={close}
              aria-label="Close image"
              className="absolute right-4 top-4 rounded-md border border-border bg-bg-elevated p-2 text-fg"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length));
              }}
              aria-label="Previous image"
              className="absolute left-4 rounded-md border border-border bg-bg-elevated p-2 text-fg"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
            </button>
            <motion.div
              layoutId={reduced ? undefined : `gallery-${images[openIndex]?.src}`}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-4xl overflow-hidden rounded-md"
            >
              <Image
                src={images[openIndex]!.src}
                alt={images[openIndex]!.alt}
                width={1600}
                height={1000}
                className="h-auto max-h-[85vh] w-auto"
              />
            </motion.div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenIndex((i) => (i === null ? null : (i + 1) % images.length));
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 rounded-md border border-border bg-bg-elevated p-2 text-fg"
            >
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
