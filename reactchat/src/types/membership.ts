export interface MembershipServicesProps {
  joinServer: (serverId: string) => Promise<void>;
  leaveServer: (serverId: string) => Promise<void>;
  isMember: (serverId: string) => Promise<boolean>;
  isUserMember: boolean;
  error: Error | null;
  isLoading: boolean;
}
