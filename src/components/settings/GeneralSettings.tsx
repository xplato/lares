interface GeneralSettingsProps {}

export function GeneralSettings({}: GeneralSettingsProps) {
  return (
    <div className="space-y-8">
      <div className="border-border border-t border-dashed" />
      <section>
        <h2 className="mb-0.5 text-xl font-medium">About Lares</h2>
        <p className="text-muted-foreground mb-3 text-sm">
          A lightweight screenwriting app. Version 0.1.0.
        </p>
      </section>
    </div>
  );
}
