import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      {/* ナビゲーション */}
      <nav className="fixed top-0 w-full z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚗</span>
            <span className="font-bold text-lg tracking-tight">CarEstimate</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              機能
            </a>
            <a href="#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              料金
            </a>
            <Link
              href="/estimate"
              className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              無料で試す
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーローセクション */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm px-4 py-1.5 rounded-full mb-8">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            リアルタイム相場データを取得
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            中古車の相場を
            <br />
            <span className="text-blue-400">3秒で調べる</span>
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            メーカー・車種・年式・走行距離を入力するだけ。
            カーセンサーの最新データから最安値・中央値・最高値を即算出します。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/estimate"
              className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              無料で相場を調べる →
            </Link>
            <a
              href="#features"
              className="border border-gray-700 hover:border-gray-500 text-gray-300 font-medium px-8 py-4 rounded-xl text-lg transition-colors"
            >
              詳しく見る
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-6">クレジットカード不要 • 登録なしで即利用</p>
        </div>

        {/* モックUI プレビュー */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs text-gray-600">carEstimate.jp/estimate</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">最安値</div>
                <div className="text-2xl font-bold text-green-400">89<span className="text-sm">万円</span></div>
              </div>
              <div className="bg-blue-500/20 border border-blue-500/40 rounded-lg p-4 text-center">
                <div className="text-xs text-blue-300 mb-1">中央値（相場）</div>
                <div className="text-2xl font-bold text-blue-300">142<span className="text-sm">万円</span></div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">最高値</div>
                <div className="text-2xl font-bold text-red-400">198<span className="text-sm">万円</span></div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg h-16 flex items-center px-4 gap-2">
              <div className="flex-1 bg-blue-500/30 h-4 rounded-full"></div>
              <div className="text-xs text-gray-500">取得件数: 24件</div>
            </div>
          </div>
        </div>
      </section>

      {/* 機能セクション */}
      <section id="features" className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">なぜ CarEstimate？</h2>
            <p className="text-gray-400 text-lg">相場交渉の武器になる、3つの強み</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon="⚡"
              title="即時算出"
              description="入力から3秒以内にカーセンサーの最新データを解析。リアルタイムの市場価格を取得します。"
            />
            <FeatureCard
              icon="📊"
              title="統計ベースの相場"
              description="最安値・中央値・最高値の3指標で表示。グラフで価格分布を視覚的に把握できます。"
            />
            <FeatureCard
              icon="🔍"
              title="条件別の精度"
              description="メーカー・車種・年式・走行距離・グレードを組み合わせた高精度な絞り込みに対応。"
            />
          </div>
        </div>
      </section>

      {/* 料金セクション */}
      <section id="pricing" className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">シンプルな料金プラン</h2>
            <p className="text-gray-400 text-lg">まずは無料で試して、必要なら升グレードを</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {/* 無料プラン */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <div className="text-sm text-gray-500 font-medium mb-2">フリープラン</div>
              <div className="text-4xl font-bold mb-1">
                ¥0
              </div>
              <div className="text-gray-500 text-sm mb-8">ずっと無料</div>
              <ul className="space-y-3 mb-8">
                <PricingItem text="相場検索 3回/日" />
                <PricingItem text="最安値・中央値・最高値の表示" />
                <PricingItem text="価格グラフ表示" />
                <PricingItem text="---" disabled />
                <PricingItem text="詳細フィルタ" disabled />
                <PricingItem text="CSV出力" disabled />
              </ul>
              <Link
                href="/estimate"
                className="block text-center border border-gray-700 hover:border-gray-500 text-gray-300 font-medium py-3 rounded-xl transition-colors"
              >
                無料で始める
              </Link>
            </div>

            {/* プレミアムプラン */}
            <div className="bg-blue-600/10 border border-blue-500/40 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">人気</span>
              </div>
              <div className="text-sm text-blue-400 font-medium mb-2">プレミアムプラン</div>
              <div className="text-4xl font-bold mb-1">
                ¥980
                <span className="text-lg font-normal text-gray-400">/月</span>
              </div>
              <div className="text-gray-500 text-sm mb-8">いつでもキャンセル可</div>
              <ul className="space-y-3 mb-8">
                <PricingItem text="相場検索 無制限" />
                <PricingItem text="最安値・中央値・最高値の表示" />
                <PricingItem text="価格グラフ表示" />
                <PricingItem text="詳細フィルタ（色・修復歴等）" />
                <PricingItem text="CSV出力" />
                <PricingItem text="価格アラート通知" />
              </ul>
              <Link
                href="/estimate"
                className="block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                14日間無料で試す →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-24 px-6 border-t border-gray-800">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">今すぐ相場を確認する</h2>
          <p className="text-gray-400 text-lg mb-8">
            登録不要・カード不要。3秒で中古車の相場がわかります。
          </p>
          <Link
            href="/estimate"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold px-10 py-4 rounded-xl text-lg transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
          >
            無料で相場を調べる →
          </Link>
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚗</span>
            <span className="font-bold">CarEstimate</span>
          </div>
          <p className="text-sm text-gray-600">© 2026 CarEstimate. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function PricingItem({ text, disabled = false }: { text: string; disabled?: boolean }) {
  if (text === "---") {
    return <li className="border-t border-gray-800 pt-2"></li>;
  }
  return (
    <li className={`flex items-center gap-2 text-sm ${disabled ? "text-gray-600 line-through" : "text-gray-300"}`}>
      <span className={disabled ? "text-gray-700" : "text-green-400"}>
        {disabled ? "✕" : "✓"}
      </span>
      {text}
    </li>
  );
}
