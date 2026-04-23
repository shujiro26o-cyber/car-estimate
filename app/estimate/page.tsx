"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EstimateResult {
  min: number;
  median: number;
  max: number;
  count: number;
}

const MAKERS = [
  "トヨタ", "ホンダ", "日産", "マツダ", "スバル",
  "スズキ", "ダイハツ", "三菱", "レクサス", "BMW",
  "メルセデス・ベンツ", "アウディ", "フォルクスワーゲン", "その他",
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 20 }, (_, i) => currentYear - i);

export default function EstimatePage() {
  const [form, setForm] = useState({
    maker: "",
    model: "",
    year: "",
    mileage: "",
    grade: "",
  });
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          maker: form.maker,
          model: form.model,
          year: parseInt(form.year),
          mileage: parseInt(form.mileage),
          grade: form.grade,
        }),
      });

      if (!res.ok) {
        throw new Error(`サーバーエラー: ${res.status}`);
      }

      const data: EstimateResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "取得に失敗しました。バックエンドが起動しているか確認してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  const chartData = result
    ? {
        labels: ["最安値", "中央値（相場）", "最高値"],
        datasets: [
          {
            label: "価格（万円）",
            data: [result.min, result.median, result.max],
            backgroundColor: [
              "rgba(74, 222, 128, 0.5)",
              "rgba(96, 165, 250, 0.6)",
              "rgba(248, 113, 113, 0.5)",
            ],
            borderColor: [
              "rgba(74, 222, 128, 1)",
              "rgba(96, 165, 250, 1)",
              "rgba(248, 113, 113, 1)",
            ],
            borderWidth: 2,
            borderRadius: 6,
          },
        ],
      }
    : null;

  const chartOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      x: {
        grid: { color: "rgba(255,255,255,0.05)" },
        ticks: { color: "#9ca3af", callback: (v: number | string) => `${v}万円` },
      },
      y: {
        grid: { display: false },
        ticks: { color: "#d1d5db" },
      },
    },
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* ナビゲーション */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">CarEstimate</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← トップへ戻る
          </Link>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-2">中古車相場を調べる</h1>
            <p className="text-gray-400">条件を入力して相場価格を算出します</p>
          </div>

          {/* 入力フォーム */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* メーカー */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-gray-400 mb-1">
                  メーカー <span className="text-red-400">*</span>
                </label>
                <select
                  name="maker"
                  value={form.maker}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">選択してください</option>
                  {MAKERS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* 車種名 */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm text-gray-400 mb-1">
                  車種名 <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={form.model}
                  onChange={handleChange}
                  required
                  placeholder="例：プリウス、フィット"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* 年式 */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  年式 <span className="text-red-400">*</span>
                </label>
                <select
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="">選択</option>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}年
                    </option>
                  ))}
                </select>
              </div>

              {/* 走行距離 */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  走行距離 (km) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="mileage"
                  value={form.mileage}
                  onChange={handleChange}
                  required
                  min={0}
                  placeholder="例：50000"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* グレード */}
              <div className="col-span-2">
                <label className="block text-sm text-gray-400 mb-1">
                  グレード <span className="text-gray-600">（任意）</span>
                </label>
                <input
                  type="text"
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  placeholder="例：G、X、Z、ハイブリッド"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  相場を取得中...
                </>
              ) : (
                "相場を調べる"
              )}
            </button>
          </form>

          {/* エラー表示 */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 mb-6 text-sm">
              ⚠️ {error}
            </div>
          )}

          {/* 結果表示 */}
          {result && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">相場結果</h2>
                <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
                  取得件数: {result.count}件
                </span>
              </div>

              {/* 3指標 */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">最安値</div>
                  <div className="text-2xl font-bold text-green-400">
                    {result.min}
                    <span className="text-sm font-normal text-gray-400">万円</span>
                  </div>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                  <div className="text-xs text-blue-300 mb-1">中央値（相場）</div>
                  <div className="text-2xl font-bold text-blue-300">
                    {result.median}
                    <span className="text-sm font-normal text-gray-400">万円</span>
                  </div>
                </div>
                <div className="bg-gray-800 rounded-xl p-4 text-center">
                  <div className="text-xs text-gray-500 mb-1">最高値</div>
                  <div className="text-2xl font-bold text-red-400">
                    {result.max}
                    <span className="text-sm font-normal text-gray-400">万円</span>
                  </div>
                </div>
              </div>

              {/* グラフ */}
              {chartData && (
                <div className="bg-gray-800 rounded-xl p-4">
                  <Bar data={chartData} options={chartOptions} />
                </div>
              )}

              <p className="text-xs text-gray-600 mt-4 text-center">
                ※ カーセンサーの公開データをもとに算出。実際の成約価格とは異なる場合があります。
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
