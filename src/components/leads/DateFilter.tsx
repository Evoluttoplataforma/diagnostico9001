import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const presets = [
  { key: "today", label: "Hoje" },
  { key: "yesterday", label: "Ontem" },
  { key: "7d", label: "7 dias" },
  { key: "30d", label: "30 dias" },
  { key: "month", label: "Este mês" },
  { key: "last_month", label: "Mês passado" },
  { key: "all", label: "Todos" },
] as const;

interface DateFilterProps {
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
  datePreset: string;
  onPreset: (preset: string) => void;
  onFromChange: (d: Date | undefined) => void;
  onToChange: (d: Date | undefined) => void;
  onClear: () => void;
  label: string | null;
  compact?: boolean;
}

export function DateFilter({
  dateFrom,
  dateTo,
  datePreset,
  onPreset,
  onFromChange,
  onToChange,
  onClear,
  label,
  compact = false,
}: DateFilterProps) {
  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 relative">
            <CalendarIcon className="w-4 h-4" />
            {label && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="end">
          <DateFilterContent
            dateFrom={dateFrom}
            dateTo={dateTo}
            datePreset={datePreset}
            onPreset={onPreset}
            onFromChange={onFromChange}
            onToChange={onToChange}
            onClear={onClear}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 text-xs">
          <CalendarIcon className="w-3.5 h-3.5" />
          {label || "Filtrar data"}
          {label && (
            <X
              className="w-3 h-3 ml-1 opacity-60 hover:opacity-100"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
            />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <DateFilterContent
          dateFrom={dateFrom}
          dateTo={dateTo}
          datePreset={datePreset}
          onPreset={onPreset}
          onFromChange={onFromChange}
          onToChange={onToChange}
          onClear={onClear}
        />
      </PopoverContent>
    </Popover>
  );
}

function DateFilterContent({
  dateFrom,
  dateTo,
  datePreset,
  onPreset,
  onFromChange,
  onToChange,
  onClear,
}: Omit<DateFilterProps, "label" | "compact">) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {presets.map((p) => (
          <button
            key={p.key}
            onClick={() => onPreset(p.key)}
            className={cn(
              "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors",
              datePreset === p.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 items-center text-xs text-muted-foreground">
        <span>De</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <CalendarIcon className="w-3 h-3" />
              {dateFrom ? format(dateFrom, "dd/MM/yy", { locale: ptBR }) : "—"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={(d) => {
                onFromChange(d);
                if (datePreset) onPreset("");
              }}
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        <span>até</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
              <CalendarIcon className="w-3 h-3" />
              {dateTo ? format(dateTo, "dd/MM/yy", { locale: ptBR }) : "—"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={(d) => {
                onToChange(d);
                if (datePreset) onPreset("");
              }}
              locale={ptBR}
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>
      </div>

      {(dateFrom || dateTo) && (
        <Button variant="ghost" size="sm" className="h-6 text-[11px] text-muted-foreground w-full" onClick={onClear}>
          Limpar filtro
        </Button>
      )}
    </div>
  );
}
