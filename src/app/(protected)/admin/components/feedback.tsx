"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Feedback } from "@prisma/client";

interface FeedbackProps {
  feedback: Feedback[];
}

export function Feedback({ feedback }: FeedbackProps) {
  return (
    <div className="w-1/3 rounded-lg border p-2">
      <div>
        <h3 className="text-2xl font-bold">Feedback</h3>
        <p className="text-sm text-muted-foreground">User submitted feedback</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {feedback.map((fb) => (
            <TableRow key={fb.id}>
              <TableCell>{fb.createdAt.toDateString()}</TableCell>
              <TableCell>{fb.username || "-"}</TableCell>
              <TableCell>{fb.details}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
