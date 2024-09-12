interface DropTargetProps {
  sequence: {id: string, icon: string}[];
  setCode: (sequence: {id: string, icon: string}[]) => void;
  onRemove: (id: number) => void;
}

export default function DropTarget({sequence, onRemove, setCode}: DropTargetProps) {
  return (
    <div>
      <h1>DropTarget</h1>
    </div>
  );
}
