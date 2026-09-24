"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient"; // Adjust your Supabase client path
import { ExternalLink, Calendar, ChevronLeft, ChevronRight, Share2 } from "lucide-react";

interface FacebookPost {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  link_url?: string;
  created_at: string;
}

const POSTS_PER_PAGE = 6;

export default function NewsGrid() {
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPost, setSelectedPost] = useState<FacebookPost | null>(null);


  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      const from = (page - 1) * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      // 1. Fetch total count for pagination
      const { count } = await supabase
        .from("news_posts") // Match your Supabase table name
        .select("*", { count: "exact", head: true });

      // 2. Fetch paginated data
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (!error && data) {
        setPosts(data);
        if (count) setTotalPosts(count);
      }
      setLoading(false);
    }

    fetchPosts();
  }, [page]);

  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <div className="space-y-10">
      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(POSTS_PER_PAGE)].map((_, i) => (
            <div
              key={i}
              className="h-96 rounded-2xl bg-white/5 animate-pulse border border-white/10"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-white/60">
          No community posts available at the moment.
        </div>
      ) : (
        /* Posts Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-ochre/50 hover:shadow-xl hover:shadow-ochre/10"
            >
              {/* Image Preview */}
              {post.image_url ? (
                <div className="relative h-48 w-full overflow-hidden bg-black/20">
                  <Image
                    src={post.image_url}
                    alt={post.title || "Community Announcement"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                </div>
              ) : (
                <div className="h-24 w-full bg-gradient-to-r from-ochre/20 to-navy/40" />
              )}

              {/* Content Box */}
              <div className="flex flex-1 flex-col justify-between p-6 bg-white">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-ochre uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(post.created_at).toLocaleDateString("en-AU", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  <h3 className="text-xl font-bold text-ink line-clamp-2 group-hover:text-ochre transition-colors">
                    {post.title || "Community Update"}
                  </h3>

                  <p className="text-sm text-ink/70 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Footer Action */}
                <div className="mt-6 pt-4 border-t border-ink/10 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedPost(post)}
                    className="text-xs font-medium text-ink/80 hover:text-ochre transition-colors"
                  >
                    Read full notice
                  </button>

                  {post.link_url && (
                    <a
                      href={post.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-ochre hover:underline"
                    >
                      View on Facebook <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>

          <span className="text-sm text-white/70">
            Page <strong className="text-white">{page}</strong> of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || loading}
            className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Detail Modal Preview */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-navy p-6 shadow-2xl max-h-[90vh] flex flex-col">
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/70 hover:bg-black hover:text-white"
            >
              ✕
            </button>

            {selectedPost.image_url && (
              <div className="relative h-64 w-full flex-shrink-0 overflow-hidden rounded-xl mb-4">
                <Image
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="overflow-y-auto space-y-4 pr-2">
              <span className="text-xs text-ochre font-semibold uppercase">
                {new Date(selectedPost.created_at).toLocaleDateString("en-AU", {
                  dateStyle: "full",
                })}
              </span>
              <h2 className="text-2xl font-bold text-white">
                {selectedPost.title}
              </h2>
              <p className="text-white/80 whitespace-pre-line leading-relaxed text-sm">
                {selectedPost.content}
              </p>
            </div>

            {selectedPost.link_url && (
              <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                <a
                  href={selectedPost.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-ochre px-5 py-2.5 text-sm font-semibold text-navy transition-all hover:bg-ochre/90"
                >
                  Open Original Post on Facebook <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}