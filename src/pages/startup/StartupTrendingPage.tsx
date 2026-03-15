import { StartupLayout } from "@/components/layouts/StartupLayout";
import { TrendingJobsView } from "@/components/recommendations/TrendingJobsView";

export default function StartupTrendingPage() {
  return (
    <TrendingJobsView
      LayoutComponent={StartupLayout}
      actionLabel="View Details"
      jobLinkBuilder={(jobId) => `/student/jobs/${jobId}`}
    />
  );
}
