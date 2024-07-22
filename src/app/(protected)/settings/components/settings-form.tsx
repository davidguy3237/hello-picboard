"use client";

import { changePassword } from "@/actions/change-password";
import { changeUsername } from "@/actions/change-username";
import { toggle2FA } from "@/actions/toggle-2fa";
import { uploadAvatar } from "@/actions/upload-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { ExtendedUser } from "@/next-auth";
import { ChangePasswordSchema, ChangeUsernameSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { ChangeEvent, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface SettingsFormProps {
  user: ExtendedUser;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const { update } = useSession();
  const [currentAvatar, setCurrentAvatar] = useState<string | null | undefined>(
    user?.image?.includes("avatars/")
      ? `${process.env.NEXT_PUBLIC_PHOTOS_DOMAIN}/${user.image}`
      : user?.image,
  );
  const [isPending, startTransition] = useTransition();
  const [usernameDialogOpen, setUsernameDialogOpen] = useState<boolean>(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState<boolean>(false);

  const usernameForm = useForm<z.infer<typeof ChangeUsernameSchema>>({
    resolver: zodResolver(ChangeUsernameSchema),
    defaultValues: {
      username: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof ChangePasswordSchema>>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const handleUploadAvatar = (e: ChangeEvent<HTMLInputElement>) => {
    startTransition(async () => {
      if (e.target.files && e.target.files[0]) {
        const newAvatar = e.target.files[0];
        const uploadAvatarData = new FormData();
        uploadAvatarData.append("avatar", newAvatar);
        const uploadAvatarResults = await uploadAvatar(uploadAvatarData);
        if (!uploadAvatarResults.success) {
          toast.error(uploadAvatarResults.error);
        }
        if (uploadAvatarResults.success) {
          update();
          setCurrentAvatar(uploadAvatarResults.success.avatarUrl);
          toast.success("Avatar updated!");
        }
      }
    });
  };

  const onChangeUsernameSubmit = (
    values: z.infer<typeof ChangeUsernameSchema>,
  ) => {
    startTransition(async () => {
      const changeUsernameResults = await changeUsername(values);
      if (!changeUsernameResults.success) {
        setUsernameDialogOpen(false);
        toast.error(changeUsernameResults.error);
      }
      if (changeUsernameResults.success) {
        update();
        setUsernameDialogOpen(false);
        toast.success(changeUsernameResults.success);
      }
    });
  };

  const onChangePasswordSubmit = (
    values: z.infer<typeof ChangePasswordSchema>,
  ) => {
    startTransition(async () => {
      const changePasswordResults = await changePassword(values);
      if (!changePasswordResults.success) {
        setPasswordDialogOpen(false);
        toast.error(changePasswordResults.error);
      }
      if (changePasswordResults.success) {
        setPasswordDialogOpen(false);
        toast.success(changePasswordResults.success);
      }
    });
  };

  const update2FA = async () => {
    const toggle2FAResults = await toggle2FA();
    if (!toggle2FAResults.success) {
      toast.error(toggle2FAResults.error);
    }
    if (toggle2FAResults.success) {
      update();
      toast.success(toggle2FAResults.success);
    }
  };

  // TODO: I might need to refactor the forms into smaller components
  return (
    <Card className="mt-4 w-full min-w-9 max-w-screen-md p-4 text-sm shadow-lg">
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
              Change avatar
            </span>
            <Input
              onChange={handleUploadAvatar}
              type="file"
              className="hidden"
              accept="image/jpeg, image/png, image/webp, image/avif"
              disabled={isPending}
            />
          </Label>
        </div>
        <div className="mt-4 divide-y">
          <div className="grid grid-cols-3 items-center p-2">
            <span className="py-2 text-muted-foreground">Email</span>
            <span className="truncate font-medium">{user.email}</span>
          </div>
          <div className="grid grid-cols-3 items-center p-2">
            <span className="py-2 text-muted-foreground">Username</span>
            <span className="truncate font-medium">{user.name}</span>
            <Dialog
              open={usernameDialogOpen}
              onOpenChange={setUsernameDialogOpen}
            >
              <DialogTrigger className="justify-self-end text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Edit
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Change Your Username</DialogTitle>
                </DialogHeader>
                <Form {...usernameForm}>
                  <form
                    onSubmit={usernameForm.handleSubmit(onChangeUsernameSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={usernameForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={user.name || ""}
                              {...field}
                              disabled={isPending}
                            />
                          </FormControl>
                          <FormDescription>
                            You may only change your username once every 30 days
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          {!user.isOAuth && (
            <>
              <div className="grid grid-cols-3 items-center p-2">
                <span className="py-2 text-muted-foreground">Password</span>
                <span className="text-muted-foreground">********</span>
                <Dialog
                  open={passwordDialogOpen}
                  onOpenChange={setPasswordDialogOpen}
                >
                  <DialogTrigger className="justify-self-end text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                    Edit
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Your Password</DialogTitle>
                    </DialogHeader>
                    <Form {...passwordForm}>
                      <form
                        onSubmit={passwordForm.handleSubmit(
                          onChangePasswordSubmit,
                        )}
                        className="space-y-4"
                      >
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Password</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  disabled={isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>New Password</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  disabled={isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={passwordForm.control}
                          name="confirmNewPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm New Password</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="password"
                                  disabled={isPending}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" disabled={isPending}>
                          {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            "Submit"
                          )}
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="px-2 py-4">
                <div className="grid grid-cols-3 items-center">
                  <span className="text-muted-foreground">
                    Two Factor Authentication
                  </span>
                  <span
                    className={cn(
                      user.isTwoFactorEnabled
                        ? "font-medium"
                        : "italic text-muted-foreground",
                    )}
                  >
                    {user.isTwoFactorEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    className="justify-self-end"
                    defaultChecked={user.isTwoFactorEnabled}
                    onCheckedChange={update2FA}
                  />
                </div>
                <div className="text-sm italic text-muted-foreground">
                  A verification code will be sent to your email whenever you
                  sign in.
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
