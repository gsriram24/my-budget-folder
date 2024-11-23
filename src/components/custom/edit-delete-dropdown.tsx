import { Edit2, EllipsisVertical, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "../ui/dropdown-menu";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
interface EditDeleteDropdownProps {
  handleEditOpen: (open: boolean) => void;
}

function EditDeleteDropdown({ handleEditOpen }: EditDeleteDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical role="button" size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="p-2 w-56">
        <DropdownMenuItem
          onClick={() => handleEditOpen(true)}
          className="flex gap-2 items-center  hover:outline-none cursor-pointer"
        >
          <Edit2 size={20} /> <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-2 mt-2 items-center text-red-600  hover:outline-none cursor-pointer">
          <Trash2 size={20} /> <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default EditDeleteDropdown;
