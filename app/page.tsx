"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";

export default function HomePage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอก Username และ Password ก่อนเข้าใช้งาน",
        confirmButtonColor: "#2563eb",
      });
      return;
    }

    await Swal.fire({
      icon: "success",
      title: "เข้าสู่ระบบสำเร็จ",
      timer: 1200,
      showConfirmButton: false,
    });

    router.push("/showallmenu");
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-400">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-2">
          kinkun APP Dashboard
        </h1>

        <div className="text-6xl my-6">🍛</div>

        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Develop by Anothai <br />
          SAU 6619N10001
        </p>
      </div>
    </main>
  );
}