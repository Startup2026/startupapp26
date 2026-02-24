import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { Loader2 } from "lucide-react";

interface StatusStat {
  status: string;
  count: number;
}

interface TimeStat {
  date: string;
  count: number;
}

interface JobStat {
  jobId: string;
  role: string;
  count: number;
}

interface SkillStat {
  skill: string;
  count: number;
}

interface HiringAnalyticsData {
  totalApplications: number;
  statusDistribution: StatusStat[];
  applicationsOverTime: TimeStat[];
  applicationsByJob: JobStat[];
  topSkills: SkillStat[];
  conversionRate: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export function AnalyticsDashboard() {
  const [data, setData] = useState<HiringAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const result = await apiFetch<HiringAnalyticsData>(
          "/analytics/hiring/summary"
        );
        if (result.success && result.data) {
          setData(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch analytics", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) {
    return <div className="p-4">Failed to load analytics data.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Applications Over Time */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Application Trend</CardTitle>
            <CardDescription>Last 30 Days</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.applicationsOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                  name="Applications"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>All Time</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.statusDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ status, percent }) =>
                    `${status} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {data.statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Applications by Job */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Top Jobs by Applications</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.applicationsByJob}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="role" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#82ca9d" name="Applicants" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Rate & Skills Demand */}
        <div className="grid grid-cols-1 gap-6 col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Conversion Rate</CardTitle>
                <CardDescription>Shortlisted / Total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary">{data.conversionRate}%</div>
                <p className="text-xs text-muted-foreground mt-1">Percentage of applicants who passed initial screening</p>
              </CardContent>
            </Card>

            <Card className="flex-grow">
              <CardHeader className="pb-2">
                <CardTitle>Top Applicant Skills</CardTitle>
                <CardDescription>Demand among applicants</CardDescription>
              </CardHeader>
              <CardContent className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topSkills} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="skill" type="category" width={80} fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
