import { createContext } from "react";
import { MembershipServicesProps } from "../types/membership";
import { useMembershipService } from "../services/membership-service";

const initialMembershipState: MembershipServicesProps = {
  joinServer: async () => {},
  leaveServer: async () => {},
  isMember: async () => false,
  isUserMember: false,
  error: null,
  isLoading: false,
};

const MembershipContext = createContext<MembershipServicesProps>(
  initialMembershipState
);

const MembershipProvider = ({ children }: { children: React.ReactNode }) => {
  const membershipService = useMembershipService();

  return (
    <MembershipContext.Provider value={membershipService}>
      {children}
    </MembershipContext.Provider>
  );
};
export { MembershipProvider, MembershipContext };
