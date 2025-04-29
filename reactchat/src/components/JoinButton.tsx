import { useEffect, useState } from "react";
import { useMembershipService } from "../services/membership-service";
import { useParams } from "react-router-dom";

export function JoinButton() {
  const { serverId } = useParams<{ serverId: string }>();
  const { joinServer, leaveServer, isLoading, isMember } =
    useMembershipService();

  const [isUserMember, setIsUserMember] = useState(false);

  useEffect(() => {
    if (!serverId) {
      return;
    }
    isMember(serverId)
      .then((isMember) => {
        setIsUserMember(isMember);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [isUserMember]);

  const handleLeaveServer = async () => {
    if (!serverId) {
      return;
    }
    await leaveServer(serverId);
  };

  const handleJoinServer = async () => {
    if (!serverId) {
      return;
    }
    await joinServer(serverId);
  };

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {isUserMember ? (
            <button
              disabled={isLoading}
              style={{ backgroundColor: "red", color: "white" }}
              onClick={handleLeaveServer}
            >
              Leave Server
            </button>
          ) : (
            <button
              disabled={isLoading}
              style={{ backgroundColor: "green", color: "white" }}
              onClick={handleJoinServer}
            >
              Join Server
            </button>
          )}
        </>
      )}
    </div>
  );
}
