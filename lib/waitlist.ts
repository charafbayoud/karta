import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getSupabaseAdmin } from "@/lib/supabase";
import { isLocalDataMode } from "@/lib/env";

const DATA_DIR = path.join(process.cwd(), ".data");
const WAITLIST_FILE = path.join(DATA_DIR, "waitlist.json");

interface WaitlistEntry {
  id: string;
  email: string;
  created_at: string;
}

async function readLocalWaitlist(): Promise<WaitlistEntry[]> {
  try {
    const raw = await readFile(WAITLIST_FILE, "utf-8");
    return JSON.parse(raw) as WaitlistEntry[];
  } catch {
    return [];
  }
}

async function writeLocalWaitlist(entries: WaitlistEntry[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(WAITLIST_FILE, JSON.stringify(entries, null, 2), "utf-8");
}

export async function addToWaitlist(
  email: string
): Promise<{ source: "supabase" | "local"; duplicate: boolean }> {
  if (isLocalDataMode()) {
    const entries = await readLocalWaitlist();

    if (entries.some((entry) => entry.email === email)) {
      return { source: "local", duplicate: true };
    }

    entries.push({
      id: crypto.randomUUID(),
      email,
      created_at: new Date().toISOString(),
    });

    await writeLocalWaitlist(entries);
    return { source: "local", duplicate: false };
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("waitlist").insert({ email });

  if (error) {
    if (error.code === "23505") {
      return { source: "supabase", duplicate: true };
    }
    throw error;
  }

  return { source: "supabase", duplicate: false };
}
