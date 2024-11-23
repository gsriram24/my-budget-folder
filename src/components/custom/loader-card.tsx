import { Card, CardContent } from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

export default function LoaderCard() {
  return (
    <>
      <Card className="w-full min-h-56 flex items-center justify-start">
        <CardContent className="py-0 w-full">
          <Skeleton className="w-full h-8 " />
          <Skeleton className="w-full h-8 mt-6" />
        </CardContent>
      </Card>
    </>
  );
}
