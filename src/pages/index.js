import Head from "next/head";
import Login from "./Auth/login";
import Cookies from "js-cookie";
import Dashboard from "./Dashboard/dashboard";
import Link from "next/link";
import AnimationBackground from "../components/Background/background";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>IChat</title>
        <meta name="description" content="Real time chat application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AnimationBackground />
      <div className="flex justify-center items-center pt-72">
        <Link
          className="w-50 h-10 rounded p-2 m-4 bg-slate-800 z-30"
          href="/Auth/login"
        >
          Start Chatting
        </Link>
      </div>
    </>
  );
}
