import React, { useEffect, useState } from 'react';
import { firestore, auth } from '../firebase';

function MainContainer(props) {
  const { channel } = props;
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');

  function fetchMessages() {
    if (!channel.id) return;

    firestore
      .collection('messages')
      .where('channel', '==', channel.id)
      .orderBy('ts', 'asc')
      .get()
      .then((snapshot) => {
        // const channels = snapshot.docs;
        const messages = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setMessages(messages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchMessages();
  }, [channel]);

  function handleUserMessage(e) {
    setUserMessage(e.target.value);
  }

  function onEnterPress(e) {
    if (e.keyCode === 13 && channel.id && userMessage) {
      e.preventDefault();
      const data = {
        from: {
          id: auth.currentUser.uid,
          name: auth.currentUser.displayName,
        },
        text: userMessage,
        channel: channel.id,
        created_at: new Date(),
        ts:new Date(),
       
      };
      console.log(data);
      firestore
        .collection('messages')
        .add(data)
        .then((data) => {
          setUserMessage('');
          fetchMessages();
        });
    }
  }

  return (
    <div id="main-container">
      <div className="about-channel">
        <div className="channel-name"># {channel.name}</div>
        <div className="channel-desc">{channel.description}</div>
      </div>

      <div className="messages-list">
        {messages.map((message) => (
          <div className="message" key={message.id}>
            <div className="left-block">
              <img
                src="https://ca.slack-edge.com/T0188513NTW-U01867WD8GK-ga631e27835b-72"
                alt="pic"
              />
            </div>
            <div className="right-block">
              <div className="user">
                <div>{message.from.name}</div>
                <div className="toright">
                  {(message.ts.toDate()).toString()}
                  {/*{(
                    'Date: ' +
                      message.ts.getDate() +
                      '/' +
                      (message.ts.getMonth() + 1) +
                      '/' +
                      message.ts.getFullYear() +
                      ' ' +
                      message.ts.getHours() +
                      ':' +
                      message.ts.getMinutes() +
                      ':' +
                      message.ts.getSeconds()
                  )}*/}
                </div>
              </div>
              <div className="user-message">{message.text}</div>
            </div>
          </div>
        ))}

        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            No messages here!
          </div>
        )}
      </div>

      <div className="chat-box">
        <textarea
          placeholder="Type something and press enter ..."
          onChange={handleUserMessage}
          onKeyDown={onEnterPress}
          value={userMessage}
        ></textarea>
      </div>
    </div>
  );
}

export default MainContainer;
/*
"uRXx7MDdtzRXHgd6eoSvVys9Pjx1"
description
"lets learn"
members
0
"uRXx7MDdtzRXHgd6eoSvVys9Pjx1"
1
"hz6CaofTK1WEJA6TdZepi0wPnYp1"
name
"Typescript"
*/
