"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function AddMenuPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function uploadImage() {
    if (!file) return "";

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("menu-images")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("menu-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async function addMenu(e: React.FormEvent) {
    e.preventDefault();

    if (!name.trim() || !price.trim()) {
      Swal.fire({
        icon: "warning",
        title: "ข้อมูลไม่ครบ",
        text: "กรุณากรอกชื่อเมนูและราคา",
      });
      return;
    }

    try {
      setLoading(true);

      const imageUrl = await uploadImage();

      const { error } = await supabase.from("menu").insert([
        {
          name,
          price: Number(price),
          image_url: imageUrl,
        },
      ]);

      if (error) throw error;

      await Swal.fire({
        icon: "success",
        title: "เพิ่มเมนูสำเร็จ",
        timer: 1200,
        showConfirmButton: false,
      });

      router.push("/showallmenu");
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center p-6">
      <form
        onSubmit={addMenu}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center">
          Add Menu
        </h1>

        <div className="text-center text-6xl my-6">🍱</div>

        <label className="block mb-2 text-gray-700 font-medium">Name</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="ชื่อเมนู"
        />

        <label className="block mb-2 text-gray-700 font-medium">Price</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="ราคา"
          type="number"
        />

        <label className="block mb-2 text-gray-700 font-medium">Image</label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg border mb-4"
          />
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Submit"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/showallmenu")}
          className="w-full mt-3 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
        >
          Back
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          Develop by Chawanvit S. <br />
          SAU 6619N10006
        </p>
      </form>
    </main>
  );
}