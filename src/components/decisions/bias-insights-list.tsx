import { getBiasDescription } from "@/lib/bias-descriptions";
import { m } from "@/lib/i18n/uk";
import { softSurfaceClassName } from "@/lib/ui/surface-classes";
import { cn } from "@/lib/utils";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BiasInsightsList({ biases }: { biases: string[] }) {
  if (biases.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {m.decisions.analysis.noBiases}
      </p>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {biases.map((bias) => {
        const info = getBiasDescription(bias);

        return (
          <Card key={bias} size="sm" className={cn(softSurfaceClassName)}>
            <CardHeader className="gap-1.5">
              <CardTitle className="text-sm">{info.title}</CardTitle>
              {info.description ? (
                <CardDescription className="text-sm leading-relaxed text-pretty">
                  {info.description}
                </CardDescription>
              ) : null}
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
