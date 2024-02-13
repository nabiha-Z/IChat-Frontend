import Cookies from "js-cookie";
import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";

import { BASE_URL } from "../../api/urls";
import { fetchConversation } from "../../api/index";

const socket = io(BASE_URL, {
  transports: ["websocket"],
  allowEIO3: true,
  extraHeaders: {
    Authorization: `Bearer ${Cookies.get("token")}`,
    "User-Agent": "MyApp/1.0",
  },
});

function Chat({ chat }) {
  const { receiver, sender, _id } = chat;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const handleSubmitNewMessage = () => {
    socket.emit("message", {
      data: message,
      receiverId: receiver._id,
      chatId: chat._id,
    });
  };

  const handleNewMessage = (newMessage) => {
    setMessages((prevMessages) => {
      const messageExists = prevMessages.some(
        (message) => message._id === newMessage._id
      );

      if (messageExists) {
        return prevMessages;
      }

      return [...prevMessages, newMessage];
    });
    setMessage("");
  };

  const fetchChats = async () => {
    await fetchConversation(_id)
      .then((data) => {
        setMessages(data.data[0].messages);
      })
      .catch((err) => {
        // console.log("error: ", err);
      });
  };

  useEffect(() => {
    fetchChats();
    socket.on("message", (newMessage) => {
      handleNewMessage(newMessage);
    });
  }, [receiver]);

  return (
    <div className="flex flex-col w-[40rem]">
      <ToastContainer />
      <div className="flex flex-row items-center border-b border-[#4C4C50]">
        <div className="w-8 h-8 rounded-full bg-gray-300 p-1 m-3 items-center justify-center">
          <p className="font-bold text-slate-600 uppercase text-center">
            {receiver._id === Cookies.get("id")
              ? sender.name[0]
              : receiver.name[0]}
          </p>
        </div>
        <div>
          <p className="text-left font-bold text-xs">
            {receiver._id === Cookies.get("id") ? sender.name : receiver.name}
          </p>
          <p className="text-[9px] text-gray-200">
            {receiver._id === Cookies.get("id") ? sender.email : receiver.email}
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center h-[30rem] p-3">
        <div className="overflow-y-scroll h-full">
          <ul>
            {messages &&
              messages.map((message) => (
                <div
                  key={message._id}
                  className={`${
                    message["sender"] == Cookies.get("id") && "flex justify-end"
                  }`}
                >
                  <div
                    className={`w-fit p-3 ml-3 mt-2 rounded-lg bg-[#013B4F]  `}
                  >
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}
          </ul>
        </div>

        <div className="flex  mt-10">
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              value={message}
              className="bg-[#404042] p-2 rounded m-5 text-[#E7E8EB]"
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              onClick={handleSubmitNewMessage}
              className="bg-blue-700 p-2 rounded m-1"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {}

export default Chat;
