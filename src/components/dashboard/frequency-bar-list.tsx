import { cn } from "@/lib/utils";

type FrequencyBarItem = {
  label: string;
  count: number;
  key?: string;
};

export function FrequencyBarList({
  items,
  emptyMessage,
  barClassName,
  getBarClassName,
  total,
  formatValue,
  getHint,
}: {
  items: FrequencyBarItem[];
  emptyMessage: string;
  barClassName?: string;
  getBarClassName?: (item: FrequencyBarItem) => string;
  total?: number;
  formatValue?: (item: FrequencyBarItem, context: { total: number }) => string;
  getHint?: (item: FrequencyBarItem) => string | undefined;
}) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">{emptyMessage}</p>
    );
  }

  const resolvedTotal = total ?? items.reduce((sum, item) => sum + item.count, 0);
  const maxCount = Math.max(...items.map((item) => item.count));

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const width = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
        const itemBarClassName =
          getBarClassName?.(item) ?? barClassName ?? "bg-primary/70";
        const valueLabel = formatValue
          ? formatValue(item, { total: resolvedTotal })
          : String(item.count);
        const hint = getHint?.(item);

        return (
          <li key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span
                className="truncate font-medium"
                title={hint}
              >
                {item.label}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {valueLabel}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted/60">
              <div
                className={cn("h-full rounded-full transition-[width]", itemBarClassName)}
                style={{ width: `${width}%` }}
                role="presentation"
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function formatSupportDistributionValue(
  item: FrequencyBarItem,
  { total }: { total: number }
) {
  if (total <= 0) {
    return "0%";
  }

  const percent = Math.round((item.count / total) * 100);

  return `${percent}% · ${item.count}/${total}`;
}

export { formatSupportDistributionValue };
