"use client";

type CopySqlTextareaProps = {
  value: string;
};

export function CopySqlTextarea({ value }: CopySqlTextareaProps) {
  return (
    <textarea
      readOnly
      className="setup-sql-textarea"
      value={value}
      aria-label="Script SQL Strava"
      onFocus={(event) => event.currentTarget.select()}
    />
  );
}
