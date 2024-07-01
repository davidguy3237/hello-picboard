"use client";

import { format, formatDistanceToNow } from "date-fns";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Clock } from "lucide-react";

export default function DateDisplay({ date }: { date: Date }) {
  const distance = formatDistanceToNow(new Date(date), { addSuffix: true });
  const fullDate = format(new Date(date), "MMMM d, yyyy");
  const fullTimeAndDate = format(new Date(date), "h:mm a · MMMM d, yyyy");
  const dateToShow =
    distance.includes("month") ||
    distance.includes("months") ||
    distance.includes("years")
      ? fullDate
      : distance;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-end gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{dateToShow}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{fullTimeAndDate}</p>
      </TooltipContent>
    </Tooltip>
  );
}
