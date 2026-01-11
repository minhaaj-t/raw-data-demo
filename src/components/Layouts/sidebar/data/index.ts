import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Overview",
        url: "/overview",
        icon: Icons.OverviewIcon,
        items: [],
      },
      {
        title: "Total DB",
        icon: Icons.DatabaseIcon,
        items: [
          {
            title: "Retail",
            url: "/total-db/retail",
          },
          {
            title: "Wholesale",
            url: "/total-db/wholesale",
          },
          {
            title: "Restaurant",
            url: "/total-db/restaurant",
          },
          {
            title: "Food Factory",
            url: "/total-db/food-factory",
          },
          {
            title: "Distribution",
            url: "/total-db/distribution",
          },
        ],
      },
      {
        title: "Promotions DB",
        url: "/promotions-db",
        icon: Icons.PromotionIcon,
        items: [],
      },
      {
        title: "Events DB",
        icon: Icons.EventIcon,
        items: [
          {
            title: "All Events",
            url: "/events-db",
          },
          {
            title: "Marathon",
            url: "/events-db/marathon",
          },
          {
            title: "Giveaway",
            url: "/events-db/giveaway",
          },
          {
            title: "Sports",
            url: "/events-db/sports",
          },
          {
            title: "Tournament",
            url: "/events-db/tournament",
          },
          {
            title: "Competition",
            url: "/events-db/competition",
          },
          {
            title: "Charity",
            url: "/events-db/charity",
          },
          {
            title: "Concert",
            url: "/events-db/concert",
          },
          {
            title: "Festival",
            url: "/events-db/festival",
          },
          {
            title: "Other",
            url: "/events-db/other",
          },
        ],
      },
      {
        title: "Analytics",
        icon: Icons.AnalyticsIcon,
        items: [
          {
            title: "Customer Behavior",
            url: "/analytics/customer-behavior",
          },
          {
            title: "Sales Trends",
            url: "/analytics/sales-trends",
          },
          {
            title: "Product Popularity",
            url: "/analytics/product-popularity",
          },
          {
            title: "Region-wise Analysis",
            url: "/analytics/region-wise",
          },
        ],
      },
      {
        title: "Notifications / Marketing",
        url: "/notifications-marketing",
        icon: Icons.NotificationIcon,
        items: [],
      },
      {
        title: "Settings / Admin",
        icon: Icons.SettingsIcon,
        items: [
          {
            title: "User Roles & Permissions",
            url: "/settings-admin/user-roles",
          },
          {
            title: "Database Sync Settings",
            url: "/settings-admin/database-sync",
          },
          {
            title: "API Integrations",
            url: "/settings-admin/api-integrations",
          },
          {
            title: "System Logs",
            url: "/settings-admin/system-logs",
          },
          {
            title: "Backup & Restore",
            url: "/settings-admin/backup-restore",
          },
        ],
      },
    ],
  },
];
