import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export interface DevModeToggleProps {
  devMode: boolean;
  toggleDevMode: (enabled: boolean) => void;
}

const DevModeToggle = ({ devMode, toggleDevMode }: DevModeToggleProps) => {
  return (
    <div className="fixed top-24 right-4 z-50 bg-mkneutral-800/80 backdrop-blur-sm p-3 rounded-lg shadow-lg flex items-center gap-2 text-white">
      <Label
        htmlFor="validation-toggle"
        className="text-sm font-medium cursor-pointer flex items-center"
      >
        <code className="bg-mkneutral-700 px-2 py-1 rounded text-xs mr-2">
          DEV MODE
        </code>
        <span className="mr-2">Auto-fill Form</span>
      </Label>
      <Switch
        id="validation-toggle"
        checked={!devMode}
        onCheckedChange={(checked) => toggleDevMode(!checked)}
        className="data-[state=checked]:bg-primary-600"
      />
      <span className="text-xs text-mkneutral-300 ml-1">
        {!devMode ? "On" : "Off"}
      </span>
    </div>
  );
};

export default DevModeToggle;
