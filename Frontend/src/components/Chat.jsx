import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Baseurl } from '../../services api/baseurl';
import { MdKeyboardVoice } from 'react-icons/md';
import { IoIosSend } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoIosVideocam } from 'react-icons/io';
import { io } from 'socket.io-client'; // Import socket.io-client

export const Chat = () => {
  const { slectedUser } = useSelector((state) => state.user);
  const { user } = useSelector((state) => state.auth);

  const inputvalue = useRef();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null); // State for socket connection

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(Baseurl); // Replace with your backend URL
    setSocket(newSocket);

    // Cleanup on component unmount
    return () => newSocket.close();
  }, []);

  
  const getMessages = async () => {
    try {
      const senderdata = {
        senderId: user._id,
        receiverId: slectedUser._id,
      };
      const res = await axios.post(`${Baseurl}/api/messages/get_messages`, senderdata);
      const data = res.data;
      setMessages(data.data);
      console.log('Getmessage', data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user && user._id && slectedUser && slectedUser._id) {
      getMessages();
    }
  }, [slectedUser, user]);

  // Listen for incoming messages via Socket.IO
  useEffect(() => {
    if (socket) {
      socket.on('receiveMessage', (newMessage) => {
        console.log('messagefromsocket.io',newMessage)
        setMessages((prevMessages) => [...prevMessages, newMessage]); // Add the new message to the state
      });
    }
  }, [socket]);

  // Handle sending a message
  const handlemessaage = async () => {
    try {
      const messagedata = {
        senderId: user._id,
        receiverId: slectedUser._id,
        message: inputvalue.current.value, // with the help of useRef
      };
      const SocketIoMessage=  {
        userId: user._id,
       
        message: inputvalue.current.value, // with the help of useRef
      };
      // Emit the message to the server via Socket.IO
      socket.emit('sendMessage', SocketIoMessage);

      // Save the message in the database
      const resp = await axios.post(`${Baseurl}/api/messages/send_message`, messagedata);
      const data = resp.data;

      console.log('Message sent:', data);
      inputvalue.current.value = '';
    } catch (error) {
      console.log(error);
    }
  };

  if (!slectedUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-700 bg-white px-6 py-3 rounded-lg shadow-md">
          Get Started by Selecting a User
        </h1>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col">
        {/* Chat Header */}
        <div>
          <div className="w-full max-w-[940px] fixed top-0 z-10 flex justify-between items-center py-2 px-4 bg-[#F0F2F5] py-[5px] shadow-md">
            <div className="flex gap-[10px] items-center ">
              <img
                src={slectedUser && slectedUser.profile}
                alt="Profile"
                className="ml-[13px] rounded-[50%] w-[50px] h-[50px] object-cover"
              />
              <div>
                <h3>{slectedUser && slectedUser.name}</h3>
                <span className="flex">online</span>
              </div>
            </div>
            <div className="flex gap-[15px] flex-shrink-0">
              <button className="text-[20px]">
                <IoIosVideocam />
              </button>
              <button className="text-[20px]">
                <CiSearch />
              </button>
              <button className="text-[20px]">
                <BsThreeDotsVertical />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 relative mt-[65px]">
          {messages &&
            Array.isArray(messages) &&
            messages.map((message) => (
              <div key={message._id}>
                <div
                  className={`${
                    message.userId === user._id ? 'chat chat-end ml-3' : 'chat chat-start'
                  }`}
                >
                  <div className="chat-bubble bg-green-200 text-black">{message.message}</div>
                </div>
              </div>
            ))}
        </div>

        {/* Input Field */}
        <div className="flex items-center px-4 py-2 sticky bottom-0 bg-gray-100 rounded-[10px]">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type your message..."
              className="w-full px-3 py-2 bg-[#EEEEF8] text-gray-800 rounded-md pr-[120px]"
              ref={inputvalue}
            />
            <button
              className="absolute right-16 top-1/2 transform -translate-y-1/2 text-[20px] px-3 py-1 text-black rounded-md"
              title="Voice Message"
            >
              <MdKeyboardVoice />
            </button>
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[25px] px-4 py-1 text-black rounded-md"
              title="Send Message"
              onClick={handlemessaage}
            >
              <IoIosSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
