import { Button } from "../ui/button";

type Props = {
  isOpen: boolean;
  onDelete: () => void;
  onCancel: () => void;
};

function DeletePopup({ isOpen = false, onDelete, onCancel }: Props) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/80" onClick={onCancel} />
      <div className="relative brutal-border brutal-shadow bg-background p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-heading font-bold">DELETE ITEM?</h2>
        <p className="font-mono text-sm text-muted-foreground mt-3">
          ARE YOU SURE YOU WANT TO DELETE ?
        </p>
        <p className="font-mono text-xs text-destructive mt-4">
          THIS ACTION CANNOT BE UNDONE.
        </p>
        <div className="flex gap-0 mt-6">
          <Button variant="destructive" onClick={onDelete}>
            CONFIRM DELETE
          </Button>
          <Button variant="outline" className="border-l-0" onClick={onCancel}>
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeletePopup;
