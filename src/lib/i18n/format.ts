const dateTimeFormatter = new Intl.DateTimeFormat("uk-UA", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(value: string | Date) {
  return dateTimeFormatter.format(
    typeof value === "string" ? new Date(value) : value
  );
}

function ukrainianPlural(
  count: number,
  one: string,
  few: string,
  many: string
) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) {
    return many;
  }

  if (mod10 === 1) {
    return one;
  }

  if (mod10 >= 2 && mod10 <= 4) {
    return few;
  }

  return many;
}

export function formatDecisionCount(count: number) {
  return `${count} ${ukrainianPlural(count, "рішення", "рішення", "рішень")}`;
}

export function formatAnalyzedDecisionCount(count: number) {
  return `${count} ${ukrainianPlural(count, "проаналізоване рішення", "проаналізовані рішення", "проаналізованих рішень")}`;
}

export function formatCategoryDisplay(category: string) {
  const key = category.trim().toLowerCase();

  if (key in categoryLabels && key !== "all") {
    return categoryLabels[key as keyof typeof categoryLabels];
  }

  return category
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export const categoryLabels = {
  all: "Усі категорії",
  career: "Кар'єра",
  finance: "Фінанси",
  health: "Здоров'я",
  education: "Освіта",
  lifestyle: "Стиль життя",
  relationship: "Стосунки",
} as const;
