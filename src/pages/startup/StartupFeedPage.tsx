import { StartupLayout } from "@/components/layouts/StartupLayout";
import { RecommendedFeedView } from "@/components/recommendations/RecommendedFeedView";

export default function StartupFeedPage() {
  return (
    <RecommendedFeedView
      LayoutComponent={StartupLayout}
      title="Startup Feed"
      subtitle="Stay updated with the latest from startups you follow"
    />
  );
}
