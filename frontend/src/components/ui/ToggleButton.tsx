import { Button } from "./Button";
import { ToggleButtonProps } from "../../types/types";

export const ToggleButton = ({ currentView, onToggle }: ToggleButtonProps) => {
  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={currentView === 'code' ? 'primary' : 'secondary'}
        text="Code"
        onClick={() => onToggle('code')}
      />
      <Button
        variant={currentView === 'preview' ? 'primary' : 'secondary'}
        text="Preview"
        onClick={() => onToggle('preview')}
      />
    </div>
  );
};