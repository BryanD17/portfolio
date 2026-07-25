import { Skeleton } from "@/components/ui/skeleton";

/** Skeletons match real card dimensions so data arrival causes zero CLS. */
export default function ProjectsLoading() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:px-8">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {[0, 1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[340px] w-full rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-[220px] w-full rounded-lg" />
        ))}
      </div>
    </main>
  );
}
