import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Phone } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const COUNTRIES = [
  { code: "BR", flag: "🇧🇷", name: "Brasil", ddi: "+55", mask: true },
  { code: "PT", flag: "🇵🇹", name: "Portugal", ddi: "+351", mask: false },
  { code: "US", flag: "🇺🇸", name: "Estados Unidos", ddi: "+1", mask: false },
] as const;

type Country = (typeof COUNTRIES)[number];

interface PhoneInputWithCountryProps {
  value: string;
  onChange: (fullPhone: string) => void;
  label?: string;
  delay?: number;
}

const formatBR = (digits: string) => {
  const d = digits.slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const parseInitialValue = (value: string): { country: Country; local: string } => {
  if (!value) return { country: COUNTRIES[0], local: "" };
  const clean = value.replace(/\D/g, "");

  for (const c of COUNTRIES) {
    const ddiDigits = c.ddi.replace("+", "");
    if (clean.startsWith(ddiDigits)) {
      return { country: c, local: clean.slice(ddiDigits.length) };
    }
  }

  return { country: COUNTRIES[0], local: clean };
};

export const PhoneInputWithCountry = ({
  value,
  onChange,
  label = "WhatsApp (com DDD)",
  delay = 0,
}: PhoneInputWithCountryProps) => {
  const initial = parseInitialValue(value);
  const [country, setCountry] = useState<Country>(initial.country);
  const [localNumber, setLocalNumber] = useState(initial.local);
  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayValue = country.mask ? formatBR(localNumber) : localNumber;
  const hasValue = localNumber.length > 0;

  useEffect(() => {
    const full = `${country.ddi}${localNumber}`;
    if (localNumber) onChange(full);
    else onChange("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country, localNumber]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    const max = country.mask ? 11 : 15;
    setLocalNumber(digits.slice(0, max));
  };

  const selectCountry = (selectedCountry: Country) => {
    setCountry(selectedCountry);
    setLocalNumber("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div
      className="animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "forwards" }}
    >
      <div
        className={cn(
          "group relative rounded-2xl transition-all duration-300 bg-card border-2",
          isFocused
            ? "border-primary shadow-lg shadow-primary/10 scale-[1.02]"
            : "border-border hover:border-primary/40 hover:shadow-md"
        )}
      >
        <label
          className={cn(
            "absolute left-[106px] transition-all duration-200 pointer-events-none z-10",
            isFocused || hasValue
              ? "top-2 text-xs font-medium text-primary"
              : "top-1/2 -translate-y-1/2 text-sm text-muted-foreground"
          )}
        >
          {label}
        </label>

        <div className="flex items-center">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 pl-4 pr-2 h-full py-4 border-r border-border/50 shrink-0 hover:bg-muted/30 rounded-l-2xl transition-colors"
              >
                <span className="text-lg leading-none">{country.flag}</span>
                <span className="text-sm font-medium text-foreground">{country.ddi}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-1" align="start" sideOffset={8}>
              {COUNTRIES.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => selectCountry(c)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                    c.code === country.code
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50 text-foreground"
                  )}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span className="text-sm font-medium flex-1">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.ddi}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>

          <input
            ref={inputRef}
            type="tel"
            value={displayValue}
            onChange={handleInput}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            data-lpignore="true"
            data-form-type="other"
            className="w-full px-3 pt-6 pb-3 bg-transparent outline-none text-foreground text-base font-medium placeholder:text-transparent"
          />

          <div
            className={cn(
              "absolute right-4 transition-all duration-300",
              isFocused ? "text-primary scale-110" : "text-muted-foreground"
            )}
          >
            <Phone className="w-5 h-5" />
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-0 rounded-2xl transition-opacity duration-300 pointer-events-none",
            "bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5",
            isFocused ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </div>
  );
};
