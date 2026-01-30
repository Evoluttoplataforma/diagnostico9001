import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type AnchorRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

interface RevenueSelectMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const RevenueSelectMenu = ({
  anchorEl,
  open,
  onClose,
  children,
}: RevenueSelectMenuProps) => {
  const [rect, setRect] = useState<AnchorRect | null>(null);

  const updateRect = () => {
    if (!anchorEl) return;
    const r = anchorEl.getBoundingClientRect();
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  };

  useEffect(() => {
    if (!open) return;
    updateRect();

    // Keep menu aligned with the trigger while scrolling/resizing.
    const onScrollOrResize = () => updateRect();
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anchorEl]);

  const styles = useMemo(() => {
    if (!rect) return null;
    const gap = 8;
    return {
      top: rect.top + rect.height + gap,
      left: rect.left,
      width: rect.width,
    } as const;
  }, [rect]);

  if (!open || !styles) return null;

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu */}
      <div
        className="fixed z-[1000] rounded-2xl shadow-xl overflow-hidden animate-scale-in bg-card border-2 border-border"
        style={styles}
        role="listbox"
      >
        {children}
      </div>
    </>,
    document.body
  );
};
