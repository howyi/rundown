import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

export function SummarySkeleton(props: React.ComponentPropsWithoutRef<"div">) {
	return (
		<div {...props} className={cn("space-y-2  ", props.className)}>
			<Skeleton className="h-4" />
			<Skeleton className="h-4 w-[50%]" />
			<Skeleton className="h-4 w-[70%]" />
			<Skeleton className="h-4 w-[40%]" />
		</div>
	);
}
