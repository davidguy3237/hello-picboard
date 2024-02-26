"use client";

import { settings } from "@/actions/settings";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useCurrentUser from "@/hooks/use-current-user";
import { ExtendedUser } from "@/next-auth";
import { settingsSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@prisma/client";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { notFound } from "next/navigation";
import { User } from "lucide-react";
import { Label } from "./ui/label";
import { uploadAvatar } from "@/actions/upload-avatar";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
  user: ExtendedUser;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const { update } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [editEnabled, setEditEnabled] = useState<boolean>(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.image);
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || undefined,
      email: user?.email || undefined,
      password: undefined,
      newPassword: undefined,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof settingsSchema>) => {
    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            // update();
            setSuccess(data.success);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  const handleUploadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    startTransition(async () => {
      console.log("UPLOADING AVATAR");
      if (e.target.files && e.target.files[0]) {
        const newAvatar = e.target.files[0];
        const uploadAvatarData = new FormData();
        uploadAvatarData.append("avatar", newAvatar);
        const uploadAvatarResults = await uploadAvatar(uploadAvatarData);
        if (!uploadAvatarResults.success) {
          console.error(uploadAvatarResults.error);
        }
        if (uploadAvatarResults.success) {
          update();
          setCurrentAvatar(uploadAvatarResults.success.avatarUrl);
          console.log("AVATAR URL", uploadAvatarResults.success.avatarUrl);
        }
      }
    });
  };

  return (
    <Card className="mt-4 w-full min-w-9 max-w-screen-sm p-4 shadow-lg">
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-2">
          <Avatar className="h-24 w-24">
            <AvatarImage src={currentAvatar || ""} />
            <AvatarFallback className="bg-foreground">
              <User size={48} className="text-background" />
            </AvatarFallback>
          </Avatar>
          <Label>
            <span
              className={cn(
                "hover:cursor-pointer hover:underline",
                isPending && "cursor-not-allowed text-muted-foreground",
              )}
            >
              Upload new avatar
            </span>
            <Input
              onChange={handleUploadAvatar}
              type="file"
              className="hidden"
              accept="image/jpeg, image/png"
              disabled={isPending}
            />
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
