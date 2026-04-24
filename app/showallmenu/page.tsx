"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

type Menu = {
  id: number;
  name: string;
  price: number;
  image_url: string | null;
};

export default function ShowAllMenuPage() {
  const router = useRouter();
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchMenus() {
    setLoading(true);

    const { data, error } = await supabase
      .from("menu")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      Swal.fire({
        icon: "error",
        title: "โหลดข้อมูลไม่สำเร็จ",
        text: error.message,
      });
    } else {
      setMenus(data || []);
    }

    setLoading(false);
  }

  async function deleteMenu(id: number) {
    const result = await Swal.fire({
      title: "คุณแน่ใจไหม?",
      text: "ลบแล้วจะไม่สามารถกู้คืนได้",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) return;

    const { error } = await supabase.from("menu").delete().eq("id", id);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "ลบไม่สำเร็จ",
        text: error.message,
      });
    } else {
      await Swal.fire({
        icon: "success",
        title: "ลบสำเร็จ",
        timer: 1200,
        showConfirmButton: false,
      });

      fetchMenus();
    }
  }

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-400 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">
               กินกัน APP Dashboard
              </h1>
              <p className="text-sm text-gray-500">จัดการรายการเมนูอาหาร</p>
            </div>

            <button
              onClick={() => router.push("/addmenu")}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow"
            >
              + Add Menu
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-500">
              กำลังโหลดข้อมูล...
            </div>
          ) : menus.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed rounded-xl bg-gray-50">
              <div className="text-6xl mb-4">🍛</div>
              <h2 className="text-xl font-semibold text-gray-700">
                ยังไม่มีข้อมูลเมนู
              </h2>
              <p className="text-gray-500 mt-2">
                กดปุ่ม Add Menu เพื่อเพิ่มรายการอาหาร
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-3 text-left rounded-l-lg">ID</th>
                    <th className="p-3 text-left">Image</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left">Price</th>
                    <th className="p-3 text-center rounded-r-lg">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {menus.map((menu) => (
                    <tr
                      key={menu.id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-3 text-gray-700">{menu.id}</td>

                      <td className="p-3">
                        {menu.image_url ? (
                          <img
                            src={menu.image_url}
                            alt={menu.name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center text-2xl">
                            🍽️
                          </div>
                        )}
                      </td>

                      <td className="p-3 font-medium text-gray-800">
                        {menu.name}
                      </td>

                      <td className="p-3 text-gray-700">
                        {Number(menu.price).toLocaleString()} บาท
                      </td>

                      <td className="p-3 text-center space-x-2">
                        <button
                          onClick={() => router.push(`/updatemenu/${menu.id}`)}
                          className="bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600 transition"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteMenu(menu.id)}
                          className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        <p className="text-xs text-gray-500 mt-6">
          Develop by Anothai <br />
          SAU 6619N10001
        </p>
        </div>
      </div>
    </main>
  );
}