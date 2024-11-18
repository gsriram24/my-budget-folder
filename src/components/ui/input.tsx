import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border  border-slate-200 bg-white px-3 py-2 text-base file:border-0 file:bg-transparent file:text-sm file:font-medium ring-blue-500 file:text-black placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:border-blue-800 dark:bg-blue-950 dark:ring-offset-blue-950 dark:file:text-blue-50 dark:placeholder:text-blue-400 dark:focus-visible:ring-blue-300",
					className
				)}
				ref={ref}
				{...props}
			/>
		);
	}
);
Input.displayName = "Input";

export { Input };
