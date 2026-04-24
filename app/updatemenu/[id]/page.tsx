"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function UpdateMenuPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchMenu() {
    const { data, error } = await supabase
      .from("menu")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      Swal.fire({
        icon: "error",
        title: "โหลดข้อมูลไม่สำเร็จ",
        text: error.message,
      });
      return;
    }

    setName(data.name || "");
    setPrice(String(data.price || ""));
    setOldImage(data.image_url || "");
  }

  async function uploadNewImage() {
    if (!file) return oldImage;

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

  async function updateMenu(e: React.FormEvent) {
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

      const imageUrl = await uploadNewImage();

      const { error } = await supabase
        .from("menu")
        .update({
          name,
          price: Number(price),
          image_url: imageUrl,
        })
        .eq("id", id);

      if (error) throw error;

      await Swal.fire({
        icon: "success",
        title: "อัปเดตสำเร็จ",
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

  useEffect(() => {
    fetchMenu();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center p-6">
      <form
        onSubmit={updateMenu}
        className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-2xl font-bold text-blue-600 text-center">
          Update Menu
        </h1>

        <div className="text-center text-6xl my-6">🍛</div>

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

        <label className="block mb-2 text-gray-700 font-medium">
          Current Image
        </label>

        {oldImage && !file && (
          <img
            src={oldImage}
            alt="old"
            className="w-24 h-24 object-cover rounded-lg border mb-4"
          />
        )}

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-24 h-24 object-cover rounded-lg border mb-4"
          />
        )}

        <label className="block mb-2 text-gray-700 font-medium">
          Change Image
        </label>
        <input
          className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? "Updating..." : "Update"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/showallmenu")}
          className="w-full mt-3 bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600 transition"
        >
          Back
        </button>

        <p className="text-xs text-gray-500 mt-6">
          Develop by Anothai <br />
          SAU 6619N10001
        </p>
      </form>
    </main>
  );
}