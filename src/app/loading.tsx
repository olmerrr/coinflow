import { FullPageSpinner } from "@/components/full-page-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <FullPageSpinner message="Loading page…" />
    </div>
  );
}
