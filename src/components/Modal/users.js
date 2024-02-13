import { createConversation } from "../../api";
import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { toastError } from "../Toast/toast";

export default function UserModal({
  users,
  showModal,
  setShowModal,
  check,
  setCheck,
}) {

  const startConversation = async (user) => {
    await createConversation({ receiver: user._id, messsages: [] })
      .then((data) => {
        setShowModal(!showModal);
        setCheck(!check);
        return {
          redirect: {
            destination: "/Dashboard/dashboard",
            permanent: false,
          },
        };
      })
      .catch((err) => {
        if (err.response.data["statusCode"] === 401) {
          const state = { error: err.response.data["message"] };
          const query = new URLSearchParams(state).toString();
          const destination = `/Auth/login?${query}`;
          return {
            redirect: {
              destination: destination,
              permanent: false,
            },
          };
        }
      });
  };

  return (
    <>
      <div
        className={`flex justify-center items-center fixed inset-0 z-10 bg-[#181818] bg-opacity-50 ${
          showModal ? "block" : "hidden"
        }`}
      >
        <ToastContainer />
        <div className="modal-box">
          <button
            onClick={() => setShowModal(!showModal)}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            ✕
          </button>
          <h3 className="text-lg font-bold">
            Select User to start the conversation
          </h3>
          <div className="flex-col justify-center w-fit">
            {users &&
              users.map((user) => (
                <button
                  key={user._id}
                  className="flex flex-row items-center"
                  onClick={() => startConversation(user)}
                >
                  <div className="w-10 h-10 rounded-full bg-gray-300 p-2 m-3 items-center justify-center">
                    <p className="font-bold text-slate-600 uppercase text-center">
                      {user.name[0]}
                    </p>
                  </div>
                  <div className="">
                  <p className="font-bold text-left">{user.name}</p>
                  <p className="text-[9px] text-gray-200">{user.email}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
