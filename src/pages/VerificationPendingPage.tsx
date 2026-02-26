import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

export default function StartupVerificationPendingPage() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await authService.getStartupVerificationStatus();
      if (res.success && res.data) {
        setStatus(res.data.status);
      }
      setLoading(false);
    };
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          {status === 'pending' && (
            <>
              <Clock className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
              <CardTitle>Verification Pending</CardTitle>
              <CardDescription>Your startup verification is under review. We'll notify you once it's approved.</CardDescription>
            </>
          )}
          {status === 'approved' && (
            <>
              <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
              <CardTitle>Verification Approved!</CardTitle>
              <CardDescription>Your startup has been verified. You can now access all features.</CardDescription>
            </>
          )}
          {status === 'rejected' && (
            <>
              <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
              <CardTitle>Verification Rejected</CardTitle>
              <CardDescription>Unfortunately, your verification was rejected. Please resubmit with correct information.</CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'approved' && (
            <Button onClick={() => navigate('/startup/create-profile')} className="w-full">
              Continue to Profile Setup
            </Button>
          )}
          {status === 'rejected' && (
            <Button onClick={() => navigate('/startup/verification')} className="w-full">
              Resubmit Verification
            </Button>
          )}
          {status === 'pending' && (
            <Button onClick={() => navigate('/dashboard')} variant="outline" className="w-full">
              Go to Dashboard
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}