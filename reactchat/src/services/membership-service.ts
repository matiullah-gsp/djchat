import { BASE_URL } from "../config";
import { useState } from "react";
import { useAxiosWithInterceptor } from "../helper/jwt-interceptor";

export function useMembershipService() {
  const jwtAxios = useAxiosWithInterceptor();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isUserMember, setIsUserMember] = useState(false);

  const joinServer = async (serverId: string) => {
    setIsLoading(true);
    try {
      const response = await jwtAxios.post(
        `${BASE_URL}/server-memberships/${serverId}/membership/`,
        {},
        { withCredentials: true }
      );
      setIsUserMember(true);
      return response.data;
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const leaveServer = async (serverId: string) => {
    setIsLoading(true);
    try {
      const response = await jwtAxios.delete(
        `${BASE_URL}/server-memberships/${serverId}/membership/remove_member/`,
        { withCredentials: true }
      );
      setIsUserMember(false);
      return response.data;
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const isMember = async (serverId: string) => {
    console.log("Server Id:", serverId);
    setIsLoading(true);
    try {
      const response = await jwtAxios.get(
        `${BASE_URL}/server-memberships/${serverId}/membership/is_member/`,
        { withCredentials: true }
      );
      console.log("Response Is Member:", response.data);
      setIsUserMember(response.data.is_member);
      return response.data.is_member;
    } catch (error) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { joinServer, leaveServer, isMember, isLoading, error, isUserMember };
}
