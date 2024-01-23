"use client";

import { useSession, signOut } from "next-auth/react";
import { logOut } from "@/actions/logout";
import useCurrentUser from "@/hooks/use-current-user";

export default function SettingsPage() {
  // const session = useSession(); <== refer to /hooks/use-current-user.ts to know why we're not using this
  const user = useCurrentUser();

  const onClick = () => {
    logOut();
    // signOut(); <--- Use one or the other, not both
    // To sign out of the account, you can either directly run signOut() from next-auth/react
    // Or sign out using server actions i.e. @/actions/logout
  };

  return (
    <div className="rounded-xl bg-white p-10">
      <button onClick={onClick} type="submit">
        Sign out
      </button>
    </div>
  );
}
