import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * In-app help page — workspace convention: every feature change updates
 * the matching help section in the SAME change (see CLAUDE.md).
 * Replace the placeholder sections with real guides as features land.
 */
export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Help</h1>
        <p className="text-muted-foreground">
          How to use this app, organised by task.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Sign in with your work account. If you can&apos;t log in, your
            account may not be active yet — contact your administrator.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>[Feature name]</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            Replace this section with a step-by-step guide when the feature
            ships. Keep one card per feature, written for the person doing
            the task, not the person who built it.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
