import axios from "axios";
import { useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

import { signup } from "../../api";
import { toastError, toastSuccess } from "../../components/Toast/toast";
import AnimatedBackground from "../../components/Background/background";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const register = async () => {
    await signup({ name, email, password })
      .then((data) => {
        Cookies.set("token", data.data.access_token);
        Cookies.set("id", data.data.payload.id);
        router.push("/Dashboard/dashboard");
        toastSuccess("Successfully signed up");
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

  return (
    <>
      <AnimatedBackground />
      <div className="flex flex-col justify-center items-center h-screen absolute z-30 w-screen">
        <ToastContainer />
        <p className="text-lg uppercase font-bold">Register</p>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col">
            <input
              minLength="3"
              name="name"
              id="name"
              type="text"
              placeholder="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="opacity bg-black border border-gray-200 rounded w-52 p-2 m-3"
              required
            />
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
              onClick={() => register()}
              className="bg-gray-700 rounded p-2"
            >
              Sign Up
            </button>
          </div>
        </form>

        <Link href="/Auth/login" className=" text-xs m-3">
          Login
        </Link>
      </div>
    </>
  );
}
