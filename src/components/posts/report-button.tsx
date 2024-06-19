"use client";
import { reportPost } from "@/actions/reports";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useCurrentUser from "@/hooks/use-current-user";
import { ReportSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flag, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export function ReportButton({ postId }: { postId: string }) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [showUrlInput, setShowUrlInput] = useState<boolean>(false);
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof ReportSchema>>({
    resolver: zodResolver(ReportSchema),
    defaultValues: {
      postId: postId,
      userId: user?.id,
      url: "",
      details: "",
    },
  });

  const onSubmit = (reportData: z.infer<typeof ReportSchema>) => {
    startTransition(async () => {
      const reportPostResults = await reportPost(reportData);
      if (!reportPostResults.success) {
        toast.error(reportPostResults.error);
      } else if (reportPostResults.success) {
        setShowModal(false);
        form.reset();
        toast.success(reportPostResults.success);
      }
    });
  };

  const checkRadioValue = (value: string) => {
    if (value === "duplicate" || value === "quality") {
      setShowUrlInput(true);
    } else {
      setShowUrlInput(false);
    }
  };

  if (!user) {
    return (
      <Link href={"/login"} prefetch={false}>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full justify-between active:bg-background"
        >
          <Flag className="mr-2 h-4 w-4" />
          Report
        </Button>
      </Link>
    );
  }

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex w-full justify-between active:bg-background"
        >
          <Flag className="mr-2 h-4 w-4" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Post</DialogTitle>
          <DialogDescription>
            Why are you reporting this post?
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        checkRadioValue(value);
                      }}
                      className="space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="spam" />
                        </FormControl>
                        <FormLabel>Spam</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="duplicate" />
                        </FormControl>
                        <FormLabel>Duplicate Post</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="quality" />
                        </FormControl>
                        <FormLabel>Higher Quality Image Exists</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="unrelated" />
                        </FormControl>
                        <FormLabel>Unrelated Content</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="guidelines" />
                        </FormControl>
                        <FormLabel>Violates Content Guidelines</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="explicit" />
                        </FormControl>
                        <FormLabel>Explicit Content</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="other" />
                        </FormControl>
                        <FormLabel>Other</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showUrlInput && (
              <FormField
                disabled={isPending}
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Provide a link" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              disabled={isPending}
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Details</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Provide more details if necessary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex w-full items-end justify-between">
              <p className="text-sm">
                Please refer to the{" "}
                <Link
                  href="/guidelines"
                  className="text-sm underline hover:font-bold"
                  target="_blank"
                >
                  Content Guidelines
                </Link>
              </p>

              <Button
                variant="destructive"
                size="lg"
                type="submit"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  "Report"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
