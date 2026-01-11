import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { DataTable } from "@/components/DataTable";
import { ExportButton } from "@/components/ExportButton";
import {
  FilterBar,
  SearchFilter,
  SelectFilter,
  DateRangeFilter,
} from "@/components/Filters";
import { generateMockEvents } from "@/lib/mock-data";

type PropsType = {
  searchParams: Promise<{
    search?: string;
    type?: string;
    status?: string;
    eventCategory?: string;
    location?: string;
    dateRange?: string;
  }>;
};

export default async function EventsDbPage(props: PropsType) {
  const searchParams = await props.searchParams;
  const urlSearchParams = new URLSearchParams(
    Object.entries(searchParams).reduce(
      (acc, [key, value]) => {
        if (value) acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    ),
  );

  // Generate events data (simulate API delay)
  await new Promise(resolve => setTimeout(resolve, 100));
  let events = generateMockEvents(150); // Generate more events for pagination demo

  // Apply filters
  const search = urlSearchParams.get("search");
  const type = urlSearchParams.get("type");
  const status = urlSearchParams.get("status");
  const eventCategory = urlSearchParams.get("eventCategory");
  const location = urlSearchParams.get("location");
  const dateRange = urlSearchParams.get("dateRange");

  if (search) {
    const searchLower = search.toLowerCase();
    events = events.filter(
      (event) =>
        event.id.toLowerCase().includes(searchLower) ||
        event.name.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower),
    );
  }

  if (type) {
    events = events.filter((event) => event.type === type);
  }

  if (status) {
    events = events.filter((event) => event.status === status);
  }

  if (eventCategory) {
    events = events.filter((event) => event.eventCategory === eventCategory);
  }

  if (location) {
    events = events.filter((event) => event.location === location);
  }

  if (dateRange) {
    const [start, end] = dateRange.split(",");
    const startDate = new Date(start);
    const endDate = new Date(end);
    events = events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  return (
    <>
      <Breadcrumb pageName="Events DB" />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-dark dark:text-white">
            All Events
          </h2>
          <ExportButton data={events} filename="events" />
        </div>

        <FilterBar>
          <SearchFilter
            placeholder="Search events..."
            paramKey="search"
            className="min-w-[300px]"
          />
          <SelectFilter
            paramKey="type"
            placeholder="All Types"
            options={[
              { value: "marathon", label: "Marathon" },
              { value: "giveaway", label: "Giveaway" },
              { value: "sports", label: "Sports" },
              { value: "tournament", label: "Tournament" },
              { value: "competition", label: "Competition" },
              { value: "charity", label: "Charity" },
              { value: "concert", label: "Concert" },
              { value: "festival", label: "Festival" },
              { value: "other", label: "Other" },
            ]}
          />
          <SelectFilter
            paramKey="status"
            placeholder="All Status"
            options={[
              { value: "upcoming", label: "Upcoming" },
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <SelectFilter
            paramKey="eventCategory"
            placeholder="All Categories"
            options={[
              { value: "sports", label: "Sports" },
              { value: "entertainment", label: "Entertainment" },
              { value: "charity", label: "Charity" },
              { value: "competition", label: "Competition" },
              { value: "cultural", label: "Cultural" },
            ]}
          />
          <SelectFilter
            paramKey="location"
            placeholder="All Locations"
            options={[
              { value: "Doha", label: "Doha" },
              { value: "Al Wakrah", label: "Al Wakrah" },
              { value: "Al Khor", label: "Al Khor" },
              { value: "Umm Salal", label: "Umm Salal" },
              { value: "Al Shamal", label: "Al Shamal" },
              { value: "Al Daayen", label: "Al Daayen" },
              { value: "Al Rayyan", label: "Al Rayyan" },
              { value: "Lusail", label: "Lusail" },
              { value: "Villaggio Mall", label: "Villaggio Mall" },
              { value: "Mall of Qatar", label: "Mall of Qatar" },
            ]}
          />
          <DateRangeFilter paramKey="dateRange" />
        </FilterBar>

        <DataTable
          data={events}
          pagination={{ pageSize: 25, showPagination: true }}
          columns={[
            { key: "id", header: "ID", sortable: true },
            { key: "name", header: "Name", sortable: true },
            {
              key: "type",
              header: "Type",
              sortable: true,
            },
            {
              key: "date",
              header: "Date",
              sortable: true,
              renderType: "date",
            },
            {
              key: "status",
              header: "Status",
              sortable: true,
            },
            { key: "location", header: "Location", sortable: true },
            {
              key: "participants",
              header: "Participants",
              sortable: true,
            },
            {
              key: "participantNames",
              header: "Key Participants",
              sortable: false,
            },
            {
              key: "winnerNames",
              header: "Winners",
              sortable: false,
            },
            {
              key: "prizeAmount",
              header: "Prize",
              sortable: true,
            },
            {
              key: "newCustomers",
              header: "New Customers",
              sortable: true,
            },
            {
              key: "salesSpike",
              header: "Sales Spike",
              sortable: true,
              renderType: "percentage",
            },
            {
              key: "eventCategory",
              header: "Category",
              sortable: true,
            },
          ]}
          emptyMessage="No events found"
        />
      </div>
    </>
  );
}
