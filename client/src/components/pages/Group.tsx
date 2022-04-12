import React from "react";
import { useParams } from "react-router-dom";

const Group: React.FC = () => {

  const { groupId } = useParams();

  return (
    <div className="h-screen">
      Group {groupId}
    </div>
  )
}

export default Group;