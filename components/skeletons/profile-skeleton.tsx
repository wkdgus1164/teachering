import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (
    <>
      <div className="bg-muted/40 border-b">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
                <Skeleton className="h-9 w-32 mx-auto md:mx-0" />
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mb-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-32" />
              </div>

              <div className="flex justify-center md:justify-start gap-6">
                <div className="text-center">
                  <Skeleton className="h-6 w-8 mx-auto" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-8 mx-auto" />
                  <Skeleton className="h-4 w-16 mt-1" />
                </div>
              </div>

              <div className="mt-4">
                <Skeleton className="h-4 w-full max-w-md" />
                <Skeleton className="h-4 w-3/4 max-w-md mt-2" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <Skeleton className="h-10 w-64 mb-6" />

        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    </>
  )
}
