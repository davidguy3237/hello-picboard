// "use client";
"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { UserRole } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { admin } from "@/actions/admin";

export default function AdminPage() {
  const onServerActionClick = () => {
    admin().then((data) => {
      if (data.error) {
        console.log(data.error);
      }
      if (data.success) {
        console.log(data.success);
      }
    });
  };
  const onApiRouteClick = () => {
    fetch("/api/admin").then((response) => {
      if (response.ok) {
        console.log("OKAY");
      } else {
        console.error("FORBIDDEN");
      }
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
          <FormSuccess message="You are allowed to see this content" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin Only API Route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin Only Server Action</p>
          <Button onClick={onServerActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Testing Admin protected functionality
