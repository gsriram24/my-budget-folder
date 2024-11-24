import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteProps {
  keyText: string;
  onDelete: () => void;
  open: boolean;
  handleClose: (open: boolean) => void;
  isPending: boolean;
}

export function DeleteDialog({
  keyText,
  onDelete,
  open,
  handleClose,
  isPending,
}: DeleteProps) {
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {keyText}?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This {keyText} and all associated data
            (including statistics) will be permanently deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            disabled={isPending}
            onClick={() => handleClose(false)}
            variant="outline"
          >
            Cancel
          </Button>

          <Button variant="destructive" loading={isPending} onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
