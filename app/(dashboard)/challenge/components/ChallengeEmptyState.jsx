import { FreshDateMascot } from "@/components/nakhlah/DateMascot";

export function ChallengeEmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card px-6 py-10 text-center">
      <FreshDateMascot mood="sad" size="xxl" />
      <div className="max-w-xs space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      {action}
    </div>
  );
}
