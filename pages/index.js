"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";

function Header() {
  return (
    <header className="bg-[#FFF8E1] border-b">
      <div className="container mx-auto px-4 py-4 flex justify-end gap-4">
        <Link href="/vote">
          <Button className="bg-[#F2B950] hover:bg-[#E6A840] text-white">
            投票
          </Button>
        </Link>
        <Link href="/schedule">
          <Button className="bg-[#F2B950] hover:bg-[#E6A840] text-white">
            配達スケジュール
          </Button>
        </Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">商品概要</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Costco
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  西部ガスグループ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  ロピア
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  成城石井
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  その他
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">会社概要</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  代表者のあいさつ
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  Vision
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-gray-900">
                  SDGs
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

function StoreCard({ store, onVoteChange }) {
  const [votes, setVotes] = useState(store.votes);

  const handleVote = async (increment) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/vote/${store.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ increment }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setVotes(data.votes);
        onVoteChange(store.id, data.votes);
      } else {
        console.error("Error voting:", await response.json());
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    setVotes(store.votes);
  }, [store.votes]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-48">
          <Image
            src={store.image}
            alt={store.name}
            fill
            className="object-cover"
          />
          {store.rank && (
            <div className="absolute top-2 right-2">
              <Image
                src={`/images/rank-${store.rank}.png`} // ランクに応じた画像を表示
                alt={`順位 ${store.rank}`}
                width={50} // 適切なサイズを指定
                height={50}
              />
            </div>
          )}
        </div>
        <div className="p-6">
          <Link href={`/store/${store.id}`}>
            <h4 className="text-xl font-bold hover:text-blue-600 transition-colors">
              {store.name}
            </h4>
          </Link>
          <p className="text-gray-600 mb-6 whitespace-pre-line">
            {store.description}
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleVote(false)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                -
              </Button>
              <span className="font-bold text-lg">{votes}</span>
              <Button
                onClick={() => handleVote(true)}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                +
              </Button>
            </div>
            <Link href={`/store/${store.id}/purchase`}>
              <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
                購入
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const [stores, setStores] = useState([]);

  const fetchStores = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/stores");
      if (response.ok) {
        const data = await response.json();
        setStores(data);
      } else {
        console.error("Error fetching stores:", await response.json());
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const handleVoteChange = (id, newVotes) => {
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === id ? { ...store, votes: newVotes } : store
      )
    );
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const sortedStores = stores.sort((a, b) => b.votes - a.votes);
  const rankedStores = sortedStores.map((store, index) => ({
    ...store,
    rank: index < 3 ? index + 1 : undefined,
  }));

  const retailers = rankedStores.filter((store) => store.type === "retail");
  const restaurants = rankedStores.filter(
    (store) => store.type === "restaurant"
  );

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Image
            src="/images/logo.png"
            alt="Company logo in JPG format"
            width={100}
            height={100}
            className="rounded-full"
          />
          <h1 className="text-4xl font-bold text-[#006837]">SGデリマルシェ</h1>
          <h2 className="text-4xl font-bold text-[#006837]">投票ページ</h2>
        </div>

        <section className="mb-12">
          <h3 className="text-xl font-bold mb-6">投票受付中の小売店舗</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {retailers.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onVoteChange={handleVoteChange}
              />
            ))}
          </div>
        </section>
        <section className="mb-12">
          <h3 className="text-xl font-bold mb-6">投票受付中の飲食店舗</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {restaurants.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onVoteChange={handleVoteChange}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
