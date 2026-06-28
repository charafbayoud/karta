"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function AccountDeletedNotice() {
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (searchParams.get("account_deleted") === "1") {
      setVisible(true);
    }
  }, [searchParams]);

  if (!visible) return null;

  return (
    <div className="account-deleted-notice" role="status">
      <p>Your account has been deleted.</p>
      <button type="button" aria-label="Dismiss" onClick={() => setVisible(false)}>
        ×
      </button>
    </div>
  );
}
