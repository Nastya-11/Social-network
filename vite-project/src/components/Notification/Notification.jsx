import React from "react";

const NOTIFICATION_TYPES = {
  LIKE: "like",
  FOLLOW: "follow",
  COMMENT: "comment",
};

const Notification = ({ notification }) => {
  switch (notification.type) {
    case NOTIFICATION_TYPES.LIKE:
      return (
        <div className="notification">
          <p>
            {notification.user.name} {notification.message}
          </p>
        </div>
      );
    case NOTIFICATION_TYPES.FOLLOW:
      return (
        <div className="notification">
          <p>{notification.user.name} followed you</p>
        </div>
      );
    case NOTIFICATION_TYPES.COMMENT:
      return (
        <div className="notification">
          <p>{notification.user.name} commented on your post</p>
        </div>
      );
    default:
      return (
        <div className="notification">
          <p>{notification.message}</p>
        </div>
      );
  }
};

export default Notification;
