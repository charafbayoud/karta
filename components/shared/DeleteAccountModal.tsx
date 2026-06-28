"use client";

import { useActionState, useEffect, useState } from "react";
import {
  deleteUserAccountAction,
  exportUserDataAction,
  type AccountActionState,
} from "@/lib/auth/account-actions";

const initialState: AccountActionState = {};

type DeleteAccountModalProps = {
  open: boolean;
  requiresPassword: boolean;
  onClose: () => void;
};

export function DeleteAccountModal({
  open,
  requiresPassword,
  onClose,
}: DeleteAccountModalProps) {
  const [confirmation, setConfirmation] = useState("");
  const [password, setPassword] = useState("");
  const [state, formAction, pending] = useActionState(deleteUserAccountAction, initialState);

  useEffect(() => {
    if (!open) {
      setConfirmation("");
      setPassword("");
    }
  }, [open]);

  if (!open) return null;

  const needsPassword = requiresPassword || state.requiresPassword;
  const canDelete = confirmation === "DELETE" && !pending && (!needsPassword || password.length > 0);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="delete-account-title">Are you sure?</h2>
        <p>
          This will permanently delete your account, saved routes, and personal data. This action
          cannot be undone.
        </p>

        <form action={formAction} className="settings-form">
          {needsPassword ? (
            <label className="settings-field">
              <span>Password</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
          ) : null}

          <label className="settings-field">
            <span>Type DELETE to confirm</span>
            <input
              type="text"
              name="confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
            />
          </label>

          {state.error ? <p className="settings-error">{state.error}</p> : null}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-danger" disabled={!canDelete}>
              {pending ? "Deleting…" : "Delete Permanently"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SettingsActions({
  requiresPassword,
}: {
  requiresPassword: boolean;
}) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [exportState, setExportState] = useState<AccountActionState | null>(null);
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    setExportState(null);

    try {
      const result = await exportUserDataAction();
      setExportState(result);

      if (result.exportJson && result.exportFilename) {
        const blob = new Blob([result.exportJson], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = result.exportFilename;
        link.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <section className="dashboard-panel settings-panel">
        <h2>Your data</h2>
        <p className="dashboard-sub">
          Download a copy of your profile and saved routes in JSON format.
        </p>
        <button type="button" className="btn-secondary" onClick={handleExport} disabled={exporting}>
          {exporting ? "Preparing export…" : "Download My Data"}
        </button>
        {exportState?.error ? <p className="settings-error">{exportState.error}</p> : null}
      </section>

      <section className="dashboard-panel settings-panel settings-panel--danger">
        <h2>Danger Zone</h2>
        <p className="dashboard-sub">
          Deleting your account is permanent. All your routes, history, and data will be
          permanently removed.
        </p>
        <button type="button" className="btn-danger" onClick={() => setDeleteOpen(true)}>
          Delete My Account
        </button>
      </section>

      <DeleteAccountModal
        open={deleteOpen}
        requiresPassword={requiresPassword}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
