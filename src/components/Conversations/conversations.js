import Cookies from "js-cookie";
import { useEffect, useState } from "react";

import Chat from "../Chat/chat";
import { fetchUserChats } from "../../api";
import { filterUsers } from "../../heplers/Chat/chat";
import UserModal from "../Modal/users";

export default function Conversations({ users }) {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [check, setCheck] = useState(false);
  const [remainingUsers, setRemainingUsers] = useState([]);

  const fetchchats = async () => {
    await fetchUserChats()
      .then((data) => {
        setChats(data.data);
        filterUsers({allChats: data.data, users, setRemainingUsers});
      })
      .catch((err) => {});
  };

  useEffect(() => {
    fetchchats();
  }, [check]);

  return (
    <div className="border border-gray-600 rounded p-6 w-full">
      <div className="flex flex-row justify-between">
        <h1 className="font-bold text-lg mt-3">Conversations</h1>

        <button
          onClick={() => setShowModal(!showModal)}
          className="btn rounded-full w-12 h-10 font-bold"
        >
          +
        </button>

        {showModal && (
          <UserModal
            users={remainingUsers}
            showModal={showModal}
            setShowModal={setShowModal}
            check={check}
            setCheck={setCheck}
          />
        )}
      </div>

      <div className="flex flex-row justify-between">
        <div className="border-r p-4 border-[#636466]">
          {chats &&
            chats.map((item) => (
              <button
                key={item._id}
                className="flex flex-row items-center "
                onClick={() => {
                  setCurrentChat(item);
                  setShowChat(true);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-gray-300 p-2 m-3 items-center justify-center">
                  <p className="font-bold text-slate-600 uppercase text-center">
                    {item.receiver._id === Cookies.get("id")
                      ? item.sender.name[0]
                      : item.receiver.name[0]}
                  </p>
                </div>
                <div>
                  <p className="text-left font-bold">
                    {item.receiver._id === Cookies.get("id")
                      ? item.sender.name
                      : item.receiver.name}
                  </p>
                  <p className="text-[9px] text-gray-200">
                    {item.receiver._id === Cookies.get("id")
                      ? item.sender.email
                      : item.receiver.email}
                  </p>
                </div>
              </button>
            ))}
        </div>
        {showChat ? (
          <Chat chat={currentChat} />
        ) : (
          <div className="flex justify-center items-center m-24">
            <p>Select any user from the list to continue chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
