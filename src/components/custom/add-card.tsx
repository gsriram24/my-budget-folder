import { FC } from "react";
import { Card, CardContent } from "../ui/card";
import { PlusIcon } from "lucide-react";

interface AddCardProps {
	label: string;
}

export default function AddCard({ label }: AddCardProps) {
	return (
		<>
			<Card className="w-full min-h-56 flex items-center justify-center">
				<CardContent className=" p-0 ">
					<PlusIcon size={80} strokeWidth={0.5} />
				</CardContent>
			</Card>
			<h3 className="text-left text-lg font-semibold mt-2">Add new</h3>
		</>
	);
}
