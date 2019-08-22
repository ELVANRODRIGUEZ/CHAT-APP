import React from "react";
//Icon importing from React Icons that we will later on use in Component form.
import {FaVideo} from 'react-icons/fa';
import {FaUserPlus} from 'react-icons/fa';
// import {MdKeyboardControl} from 'react-icons/md';

export default function({ name, numberOfUsers }) {
  return (
    <div className="chat-header">
      <div className="user-info">
        <div className="user-name">{name} Chat</div>
        <div className="status">
          <div className="indicator"></div>
          {/* //This will show the Chat connected users. */}
          <span>{numberOfUsers ? `(${numberOfUsers}-users connected)` : null}</span>
        </div>
      </div>
      <div className="options">
          <FaVideo/>
          <FaUserPlus/>
          {/* <MdKeyboardControl/> */}
      </div>
    </div>
  );
}
