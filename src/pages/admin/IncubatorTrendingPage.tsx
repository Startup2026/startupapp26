import { AdminLayout } from "@/components/layouts/AdminLayout";
import { TrendingJobsView } from "@/components/recommendations/TrendingJobsView";

export default function IncubatorTrendingPage() {
  return (
    <TrendingJobsView
      LayoutComponent={AdminLayout}
      actionLabel="View Details"
      jobLinkBuilder={(jobId) => `/student/jobs/${jobId}`}
    />
  );
}
