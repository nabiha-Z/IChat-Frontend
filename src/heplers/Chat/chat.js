import Cookies from "js-cookie";

export const filterUsers = ({allChats, users, setRemainingUsers}) => {
  let filteredArray = users.filter((user) => {
    return !allChats.some(
      (chat) => chat.receiver._id === user._id || chat.sender._id === user._id
    );
  });

  filteredArray = filteredArray.filter(
    (user) => user._id !== Cookies.get("id")
  );

  setRemainingUsers(filteredArray);
};
