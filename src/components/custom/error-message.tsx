import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
interface ErrorMessageProps {
  title?: string | boolean;
  message?: string;
}
export default function ErrorMessage({
  title,
  message,
}: ErrorMessageProps): JSX.Element {
  return (
    <Alert className="mt-6 text-left" variant="destructive">
      <AlertCircle className="h-5 w-5" />
      <AlertTitle>{title || "Error"}</AlertTitle>
      <AlertDescription>
        {message || "An error occurred. Please try again."}
      </AlertDescription>
    </Alert>
  );
}
