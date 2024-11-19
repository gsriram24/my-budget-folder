import { Loader2 } from "lucide-react";
function LoadingPage() {
	return (
		<div className="flex w-screen h-screen items-center justify-center">
			<Loader2 className="animate-spin w-16 h-16 text-blue-900" />
		</div>
	);
}

export default LoadingPage;
