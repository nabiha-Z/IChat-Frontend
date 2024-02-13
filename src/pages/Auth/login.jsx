import Link from "next/link";
import axios from "axios";
import { useState } from "react";
import * as cookie from "cookie";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import Image from "next/image";
import { setCookie } from "nookies";
import { signIn, signOut } from "next-auth/react";
import { toastError } from "../../components/Toast/toast";
import { getSession, useSession } from "next-auth/react";

import AnimatedBackground from "../../components/Background/background";
import { oauth, signin } from "../../api";

export default function Login() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { error } = router.query;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (session) {
    router.push("/Dashboard/dashboard");
  }

  const authenticateUser = async () => {
    await signin({ email, password })
      .then((data) => {
        Cookies.set("token", data.data.access_token);
        Cookies.set("id", data.data.payload.id);
        router.push("/Dashboard/dashboard");
      })
      .catch((err) => {
        let errors = err.response.data.message;
        if (typeof errors === "object") {
          errors.map((error) => {
            toastError(error);
          });
        } else {
          toastError(errors);
        }
      });
  };

  const googleLogin = async () => {
    await signIn("google", { redirect: false });
  };

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col justify-center items-center h-screen absolute z-30 w-screen">
        <p className="text-red-400 text-sm m-3">{error && error}</p>
        <p className="text-lg uppercase font-bold">Log in</p>
        <ToastContainer />
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col">
            <input
              minLength="3"
              name="username"
              id="username"
              type="text"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border border-gray-300 rounded w-52 p-2 m-3"
              required
            />

            <input
              minLength="5"
              name="password"
              id="password"
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-transparent border border-gray-300 rounded w-52 p-2 m-3"
              required
            ></input>
            <br />
            <button
              type="submit"
              value="Sign Up"
              onClick={() => authenticateUser()}
              className="bg-gray-700 opacity-70 rounded p-2 hover:opacity-90"
            >
              Sign In
            </button>
          </div>
        </form>

        <button
          className="flex flex-row justify-between items-center w-56 p-3 m-3 rounded bg-gray-800 opacity-70 hover:opacity-90"
          onClick={() => googleLogin()}
        >
          <Image src="/googlelogo.png" width={20} height={20} />
          <p>Sign in with google</p>
        </button>

        <Link href="/Auth/register" className="text-xs m-2">
          Don't have an acoount? Register
        </Link>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    const session = await getSession(context);

    if (session) {
      const { user } = session;

      const token = await axios.post("http://localhost:5000/user/o-auth", {
        user,
      });

      if (token) {
        setCookie(context, "token", token.data.access_token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });

        setCookie(context, "id", token.data.payload.id, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });

        return {
          redirect: {
            destination: "/Dashboard/dashboard",
            permanent: false,
          },
        };
      }
    } else {
      const parsedCookies = cookie.parse(context.req.headers.cookie);
      const verifiedUser = await axios.get(
        "http://localhost:5000/user/authorize",
        {
          headers: {
            authorization: `Bearer ${parsedCookies.token}`,
          },
        }
      );

      if (verifiedUser) {
        return {
          redirect: {
            destination: "/Dashboard/dashboard",
            permanent: false,
          },
        };
      }
    }
  } catch (err) {
    // console.log("err: ", err);
  }
  return {
    props: {},
  };
}
