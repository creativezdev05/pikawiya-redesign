// components/NewsPopupModal.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

export default function NewsPopupModal() {
  const [latestPost, setLatestPost] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchLatestNews = async () => {
      const { data } = await supabase
        .from("news_posts")
        .select("*")
        .eq("is_active", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setLatestPost(data);
        setIsOpen(true);
      }
    };

    fetchLatestNews();
  }, []);

  if (!isOpen || !latestPost) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        {latestPost.image_url && (
          <Image
            src={latestPost.image_url}
            alt={latestPost.title}
            className="mb-4 h-48 w-full rounded-xl object-cover"
            width="100"
            height="100"
          />
        )}

        <h3 className="mb-2 text-xl font-bold">{latestPost.title}</h3>
        <p className="mb-4 text-sm text-gray-600">{latestPost.content}</p>

        {latestPost.link_url && (
          <a
            href={latestPost.link_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-lg bg-primary px-4 py-2 text-sm text-white"
          >
            Read More
          </a>
        )}
      </div>
    </div>
  );
}