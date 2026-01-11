import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";


export default function SettingsAdminPage() {
  return (
    <>
      <Breadcrumb pageName="Settings / Admin" />

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-dark dark:text-white">
          Settings & Administration
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: "User Roles & Permissions",
              description: "Manage user roles and access permissions",
              href: "/settings-admin/user-roles",
            },
            {
              title: "Database Sync Settings",
              description: "Configure database synchronization",
              href: "/settings-admin/database-sync",
            },
            {
              title: "API Integrations",
              description: "Manage API integrations (ERP, POS, eCommerce)",
              href: "/settings-admin/api-integrations",
            },
            {
              title: "System Logs",
              description: "View and manage system logs",
              href: "/settings-admin/system-logs",
            },
            {
              title: "Backup & Restore",
              description: "Backup and restore system data",
              href: "/settings-admin/backup-restore",
            },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block rounded-[10px] border border-stroke bg-white p-6 shadow-1 transition-colors hover:bg-gray-50 dark:border-dark-3 dark:bg-gray-dark dark:hover:bg-dark-2"
            >
              <h3 className="text-lg font-semibold text-dark dark:text-white">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-dark-6">{item.description}</p>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
