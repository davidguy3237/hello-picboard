"use client";

import { logOut } from "@/actions/logout";
// import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export function LogoutButton({ children }: LogoutButtonProps) {
  const onClick = () => {
    logOut();
    // signOut(); <--- Use one or the other, not both
    // To sign out of the account, you can either directly run signOut() from next-auth/react
    // Or sign out using server actions i.e. @/actions/logout
  };

  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}
