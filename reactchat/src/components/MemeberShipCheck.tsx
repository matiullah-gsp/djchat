import { useEffect } from "react";
import { useMembershipService } from "../services/membership-service";
import { useParams } from "react-router-dom";

export function MembershipCheck({ children }: { children: React.ReactNode }) {
  const { isMember } = useMembershipService();
  const { serverId } = useParams();
  
  useEffect(() => {
    if (!serverId) {
      return;
    }
    isMember(serverId).catch((error) => {
      console.error(error);
    });
  }, [serverId]);

  return <>{children}</>;
}
