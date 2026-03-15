import { AdminLayout } from "@/components/layouts/AdminLayout";
import { RecommendedFeedView } from "@/components/recommendations/RecommendedFeedView";

export default function IncubatorFeedPage() {
  return (
    <RecommendedFeedView
      LayoutComponent={AdminLayout}
      title="Startup Feed"
      subtitle="Stay updated with the latest from startups you follow"
    />
  );
}
