import axios from 'axios';
import { toast } from "@/hooks/use-toast";

export const setupInterceptors = (navigate: any, refreshUser: any) => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const { status, data } = error.response || {};
      
      if (status === 403 && data?.code) {
        // Handle specialized access errors
        switch (data.code) {
          case 'EMAIL_UNVERIFIED':
            toast({ title: "Email Verification Required", description: "Please verify your email to continue." });
            navigate('/startup/verify-email');
            break;
          case 'PROFILE_INCOMPLETE':
            toast({ title: "Profile Required", description: "Please complete your startup profile." });
            navigate('/startup/create-profile');
            break;
          case 'PAYMENT_REQUIRED':
            toast({ title: "Subscription Required", description: "Please select a plan and complete payment." });
            navigate('/startup/select-plan');
            break;
          case 'VERIFICATION_REQUIRED':
            toast({ title: "Company Verification Pending", description: "Your company is being verified. Please wait." });
            navigate('/startup/verification-status');
            break;
        }
      }
      return Promise.reject(error);
    }
  );
};
