import React from "react";
import { Emoji } from "emoji-mart";
import inline from "./inline";
import LazyLoad from "react-lazy-load";

const imageStyle = {
  width: 800,
  margin: "0 auto",
};
const Message = ({ chat, user }) => (
  <li
    className={`list-group-item list-group-item-info chat ${
      user === chat.username && chat.right ? "right" : "left"
    }`}
  >
    {user !== chat.username && (
      <img
        className="img-responsive img-profile"
        src={chat.img}
        alt={`${chat.username}'s profile pic`}
      />
    )}

    {(() => {
      switch (chat.type) {
        case 1:
          return chat.content;
        case 2:
          return (
            <div className="img-chat">
              <LazyLoad className={` ${chat.preview ? "" : "img-fix"}`} offsetHorizontal={1}>
                <img
                  id="img-message-load-effect"
                  className={`${chat.preview ? "img-responsive" : ""}`}
                  src={chat.thumbnail_url}
                />
              </LazyLoad>
            </div>
          );
        case 3:
          return "file";
      }
    })()}
    <span className="message-time">{chat.time}</span>
  </li>
);

function PlaceholderComponent() {
  return <span>Loadin...</span>;
}

function MessageImage({ src }) {
  const reader = new FileReader();
  const img = new Image();
  let a = null;
  reader.onloadend = () => {
    img.src = src;
    img.onload = () => {
      a = <img className="img-responsive" src={src} />;
    };
  };
  ImageLoad;

  return (
    <div className="img-chat">
      <img className="img-responsive" src={src} />
    </div>
  );
}

export default Message;
