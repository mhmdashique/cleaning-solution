"use client";

import React, { ComponentProps, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useNavigationLoading } from "@/context/NavigationLoadingContext";

interface ActionLoadingLinkProps extends Omit<ComponentProps<typeof Link>, "onClick"> {
  loadingLabel?: string;
  showInlineSpinner?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function ActionLoadingLink({
  href,
  loadingLabel = "Loading...",
  showInlineSpinner = false,
  children,
  onClick,
  className,
  ...props
}: ActionLoadingLinkProps) {
  const router = useRouter();
  const { startLoading } = useNavigationLoading();
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented) {
      setClicked(true);
      startLoading(loadingLabel);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={className}
      {...props}
    >
      {showInlineSpinner && clicked ? (
        <span className="inline-flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{children}</span>
        </span>
      ) : (
        children
      )}
    </Link>
  );
}

