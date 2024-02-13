import axios from "axios";
import * as cookie from "cookie";
import Cookies from "js-cookie";
import { getSession, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { use, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchUsers, signout } from "../../api";
import { toastError } from "../../components/Toast/toast";
import Conversations from "../../components/Conversations/conversations";
import AnimatedBackground from "../../components/Background/background";
import { BASE_URL } from "../../api/urls";

export default function Dashboard({ all_users }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [users, setUsers] = useState(all_users);

  const logout = async () => {
    if (session) {
      Cookies.remove("token");
      await signOut({ redirect: false });
      router.push("/Auth/login");
    } else {
      await signout()
        .then((data) => {
          Cookies.remove("token");
          router.push("/Auth/login");
        })
        .catch((err) => {
          Cookies.remove("token");
          router.push("/Auth/login");
        });
    }
  };

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col z-30">
        <div className="flex justify-end z-30">
          <button
            className="text-center bg-red-400 p-2 rounded w-20 m-3"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>

        <ToastContainer />
        <div className="flex flex-row items-center justify-center z-30">
          <div className="">
            <Conversations users={users} />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const parsedCookies = cookie.parse(context?.req.headers.cookie);
  const session = await getSession(context);
  try {
    const verifiedUser = await axios.get(BASE_URL, {
      headers: {
        authorization: `Bearer ${parsedCookies.token}`,
      },
    });

    if (!verifiedUser && !session) {
      return {
        redirect: {
          destination: "/Auth/login",
          permanent: false,
        },
      };
    }
  } catch (err) {
    let error = err.response ? err.response.data.message : err.message;
    const state = { error: error };
    const query = new URLSearchParams(state).toString();
    const destination = `/Auth/login?${query}`;
    return {
      redirect: {
        destination: destination,
        permanent: false,
      },
    };
  }

  const response = await axios.get("http://localhost:5000/user", {
    headers: {
      authorization: `Bearer ${parsedCookies.token}`,
    },
  });

  const all_users = await response.data;
  return {
    props: {
      all_users,
    },
  };
}
