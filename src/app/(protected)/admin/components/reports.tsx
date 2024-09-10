"use client";

import { deleteReport } from "@/actions/reports";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Post, Report } from "@prisma/client";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { startTransition, useTransition } from "react";
import { toast } from "sonner";

interface ReportsProps {
  reports: (Report & {
    post: Post;
    user: {
      name: string;
    };
  })[];
}

export function Reports({ reports }: ReportsProps) {
  const [isPending, startTransition] = useTransition();

  const handleDeleteReport = (reportId: string) => {
    startTransition(async () => {
      const deleteReportResults = await deleteReport(reportId);
      if (!deleteReportResults.success) {
        toast.error(deleteReportResults.error);
        return;
      } else if (deleteReportResults.success) {
        toast.success(deleteReportResults.success);
        return;
      }
    });
  };

  return (
    <div className="mt-4 rounded-lg border p-2">
      <div>
        <h3 className="text-2xl font-bold">Reports</h3>
        <p className="text-sm text-muted-foreground">
          These posts have been reported by users
        </p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Reported Post</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="w-[300px]">Details</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Delete Report</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.createdAt.toDateString()}</TableCell>
              <TableCell>
                <Link
                  href={`/post/${report.post.publicId}`}
                  target="_blank"
                  className="text-blue-800 underline-offset-4 visited:text-purple-800 hover:underline dark:text-blue-500 dark:visited:text-purple-500"
                >
                  {report.post.publicId}
                </Link>
              </TableCell>
              <TableCell>{report.user.name}</TableCell>
              <TableCell>{report.reason}</TableCell>
              <TableCell>{report.details || "-"}</TableCell>
              <TableCell>
                {report.url ? (
                  <Link
                    href={report.url}
                    target="_blank"
                    className="text-blue-800 underline-offset-4 visited:text-purple-800 hover:underline dark:text-blue-500 dark:visited:text-purple-500"
                  >
                    {report.url}
                  </Link>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteReport(report.id)}
                  disabled={isPending}
                  className="w-16"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
