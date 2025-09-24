"use client";
import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { ConnectSupabaseSteps } from "@/components/tutorial/connect-supabase-steps";
import { SignUpUserSteps } from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { useRef, useEffect } from "react";
import { useAuth ,useUser} from "@clerk/nextjs";
import { redirect } from "next/dist/server/api-utils";
export default  function Home() {  
 
  // Protect the route by checking if the user is signed in
 

  // Simple chat-like JSON structure
  const [userMessage, setUserMessage] = useState("");
  const [chatJson, setChatJson] = useState([
    { user: "AI", message: { response: "Hello, talk about how you are feeling, when you are satisfied click generate" ,detected:[]} },
  
  ]);

function handleSendMessage(message:any) {
  if (message.trim() === "") return;
  // Add user's message
  const newChatJson = [...chatJson, { user: "User", message }];
  setChatJson(newChatJson);
  console.log(chatJson)
setUserMessage("")

  // Simulate AI response
     fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatJson: newChatJson }),

  })
    .then(res => res.json())
    .then(data => data || "Gemini could not respond.")
    .then(data=>{
      console.log(data)
      setChatJson((prev) => [...prev, { user: "AI", message: data }]);
    })
    .catch(() => "Gemini could not respond.");


}
const chatContainerRef = useRef<HTMLDivElement>(null);
function generate(){
  const inference = chatJson.slice().reverse().find(c => c.user === "AI")?.message?.detected;
  if (inference) {
    document.cookie = `inference=${encodeURIComponent(JSON.stringify(inference))}; path=/;`;
  }
  window.location.href = "/playlistmaker";
}

useEffect(() => {
  if (chatContainerRef.current) {
    const el = chatContainerRef.current;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth"
    });
  }
  // Call Gemini API for response

}, [chatJson]);
  return (
    <main className="h-[85vh] flex flex-col justify-center w-[90vw] items-center py-[10vh] z-15 relative mx-auto">
      <div className="flex-1 w-full flex flex-col  p-4 py-[8vh] items-center h-[75vh]">
      
        <h1 className="text-4xl font-bold text-center text-primary mb-8">Mood Detector</h1>
        <div className="flex-1 flex flex-col bg-gradient-to-r bg-gray-800/60 w-full gap-1 max-w-5xl p-2 rounded-xl bg-blend-lighten ">

<div
  ref={chatContainerRef}
  className="flex flex-col gap-4 overflow-y-scroll h-[60vh] w-full p-4 rounded-lg bg-gray-900/50"
>
  {
    chatJson.map((chat, idx) => (
      <div key={idx} className={`p-4 rounded-lg ${chat.user === "AI" ? "bg-secondary self-start" : "bg-chart-2 self-end text-base"} max-w-xs`}>
        <p className="text-xl">{chat.user === "AI" ? chat.message.response :chat.message}</p>
      </div>
    ))
  }
</div>
<hr className="my-4 border-t border-gray-700" />
<form
  className="w-full max-w-5xl flex sticky justify-end"
  onSubmit={(e) => {
    e.preventDefault();
    handleSendMessage(userMessage);
    setUserMessage(""); // Clear input after sending
  }}
>
  <input
    type="text"
    value={userMessage}
    onChange={(e) => setUserMessage(e.target.value)}
    placeholder="Type your message..."
    className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button
    type="submit"
    className="ml-2 px-6 py-4 rounded-lg bg-primary text-secondary font-semibold hover:scale-90 transition"
  >
    Send
  </button>
   <button
    onClick={generate}
    className="ml-2 px-6 py-4 rounded-lg bg-primary text-secondary font-semibold hover:scale-90 transition"
  >
    Generate
  </button>
</form>
        </div>
        
      </div>
    </main>
  );
}
