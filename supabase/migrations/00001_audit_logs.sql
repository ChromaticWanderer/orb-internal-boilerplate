-- Audit Logs table
-- Records all significant actions for compliance and debugging

CREATE TABLE IF NOT EXISTS audit_logs (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action        text NOT NULL,                    -- e.g., "user.created", "order.updated"
  entity_type   text NOT NULL,                    -- e.g., "user", "order", "store"
  entity_id     text NOT NULL,                    -- ID of the affected entity
  user_id       text NOT NULL,                    -- Who performed the action
  organization_id text NOT NULL,                  -- Tenant isolation
  metadata      jsonb DEFAULT '{}'::jsonb,        -- Additional context
  ip_address    inet,                             -- IP of the requester
  created_at    timestamptz DEFAULT now() NOT NULL
);

-- Indexes for common queries
CREATE INDEX idx_audit_logs_org       ON audit_logs (organization_id);
CREATE INDEX idx_audit_logs_user      ON audit_logs (user_id);
CREATE INDEX idx_audit_logs_entity    ON audit_logs (entity_type, entity_id);
CREATE INDEX idx_audit_logs_action    ON audit_logs (action);
CREATE INDEX idx_audit_logs_created   ON audit_logs (created_at DESC);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: users can only read audit logs from their own organization
CREATE POLICY "Users can read own org audit logs"
  ON audit_logs
  FOR SELECT
  USING (organization_id = current_setting('app.current_organization_id', true));

-- Policy: allow service role to insert (bypasses RLS by default, but explicit for clarity)
CREATE POLICY "Service role can insert audit logs"
  ON audit_logs
  FOR INSERT
  WITH CHECK (true);
