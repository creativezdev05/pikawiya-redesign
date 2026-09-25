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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
  <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl transition-all dark:border-white/10 dark:bg-gray-900 animate-in zoom-in-95 duration-200">
    
    {/* Close Button */}
    <button
      onClick={() => setIsOpen(false)}
      className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100/80 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-gray-800/80 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
      aria-label="Close modal"
    >
      ✕
    </button>

    {/* Image Container */}
    {/* {latestPost.image_url && ( */}
      <div className="relative mb-5 -mx-6 -mt-6 h-52 w-[calc(100%+3rem)] overflow-hidden bg-gray-100 dark:bg-gray-800">
        <Image
          src={latestPost.image_url ? latestPost.image_url : '/assets/patterns/pat1.jpg'}
          alt={latestPost.title ? latestPost.title : "pikawiya post"}
          fill
          sizes="(max-width: 768px) 100vw, 512px"
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
    {/* )} */}

    {/* Title */}
    <h3 className="mb-2.5 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
      {latestPost.title}
    </h3>

    {/* Content */}
    <p className="mb-6 text-sm leading-relaxed text-gray-600 line-clamp-4 dark:text-gray-300">
      {latestPost.content}
    </p>

    {/* Action Link */}
    {latestPost.link_url && (
      <div className="flex justify-end">
        <a
          href={latestPost.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold dark:text-gray-300 shadow-sm transition-all hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary active:scale-[0.98]"
        >
          Read More
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    )}
  </div>
</div>
  );
}