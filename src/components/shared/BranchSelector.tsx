import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const options = [
  { label: "A-21 [BRMSC012]", value: "BRMSC012" },
  { label: "B-29 [BRMSC029]", value: "BRMSC029" },
];

const BranchSelector: React.FC = () => {
  const [selectedBranch, setSelectedBranch] = useState<string>(
    options[0].value
  );

  const handleBranchChange = (value: string) => {
    setSelectedBranch(value);
    // You can add additional logic here when branch changes
    localStorage.setItem("company-branch", value);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">Branch:</span>
      <Select value={selectedBranch} onValueChange={handleBranchChange}>
        <SelectTrigger className="w-[300px] bg-gray-200 focus-visible:bg-white focus-visible:shadow-zinc-400">
          <SelectValue placeholder="Select a branch" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default BranchSelector;
