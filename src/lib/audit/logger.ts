import { createAdminClient } from "@/lib/supabase/admin";

export interface AuditEvent {
  action: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  organization_id: string;
  metadata?: Record<string, unknown>;
  ip_address?: string;
}

/**
 * Log an audit event to the `audit_logs` table in Supabase.
 *
 * Uses the admin client (service role) so RLS doesn't block inserts.
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("audit_logs").insert({
    action: event.action,
    entity_type: event.entity_type,
    entity_id: event.entity_id,
    user_id: event.user_id,
    organization_id: event.organization_id,
    metadata: event.metadata ?? {},
    ip_address: event.ip_address ?? null,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to log audit event:", error);
    // Don't throw — audit logging should not break the main flow
  }
}
