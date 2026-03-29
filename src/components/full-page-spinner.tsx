type Props = {
  message?: string;
  embed?: boolean;
};

export function FullPageSpinner({
  message = "Loading…",
  embed = false,
}: Props) {
  const wrapper = embed
    ? "flex min-h-[min(45vh,22rem)] w-full items-center justify-center py-10"
    : "flex min-h-0 w-full flex-1 flex-col items-center justify-center py-16";

  return (
    <div className={wrapper} role="status" aria-live="polite" aria-busy="true">
      <div className="flex flex-col items-center gap-4">
        <div
          className="h-11 w-11 animate-spin rounded-full border-2 border-sky-200 border-t-blue-600"
          aria-hidden
        />
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
}
