import React, { useState } from 'react';
import { ChirpPost } from '../types/game';
import { sound } from '../utils/sound';
import { 
  MessageCircle, 
  Heart, 
  Send, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  CheckCircle,
  Radio
} from 'lucide-react';

interface Props {
  chirps: ChirpPost[];
  playerName: string;
  followers: number;
  streetCred: number;
  onPostChirp: (content: string) => void;
  onLikeChirp: (id: string) => void;
}

export const ChirperFeed: React.FC<Props> = ({
  chirps,
  playerName,
  followers,
  streetCred,
  onPostChirp,
  onLikeChirp,
}) => {
  const [content, setContent] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sound.playWork();
    onPostChirp(content);
    setContent('');
  };

  const trendingTopics = [
    { tag: '#AmericanDream', count: '142K Chirps' },
    { tag: '#WallStreetBull', count: '89K Chirps' },
    { tag: '#NexaAICampus', count: '64K Chirps' },
    { tag: '#BroadwayOpenings', count: '32K Chirps' },
    { tag: '#SubwayDelays', count: '28K Chirps' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left 2 Columns: Feed */}
      <div className="lg:col-span-2 space-y-4">
        {/* Chirp Compose Box */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <form onSubmit={handlePost}>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-base shrink-0">
                {playerName.charAt(0)}
              </div>
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's happening in your city hustle? Post a Chirp..."
                  rows={2}
                  maxLength={180}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 resize-none"
                />
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-mono text-slate-500">
                    {180 - content.length} chars left
                  </div>
                  <button
                    type="submit"
                    disabled={!content.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Chirp</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Chirp Posts List */}
        <div className="space-y-3">
          {chirps.map((post) => (
            <div
              key={post.id}
              className={`p-4 rounded-2xl border transition-all ${
                post.isPlayer
                  ? 'bg-amber-500/10 border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shrink-0">
                  {post.authorAvatar}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-sm text-white">
                      {post.author}
                    </span>
                    {post.isPlayer && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 px-1.5 py-0.2 rounded">
                        YOU
                      </span>
                    )}
                    <span className="text-xs text-slate-400 font-mono">
                      {post.handle}
                    </span>
                    <span className="text-xs text-slate-500 font-mono ml-auto">
                      {post.timeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 mt-1.5 leading-relaxed">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
                    <button
                      onClick={() => {
                        sound.playClick();
                        onLikeChirp(post.id);
                      }}
                      className="flex items-center gap-1.5 hover:text-pink-400 transition-colors cursor-pointer group"
                    >
                      <Heart className="w-3.5 h-3.5 group-hover:fill-pink-500" />
                      <span>{post.likes.toLocaleString()}</span>
                    </button>
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Reply</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Chirp</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Trending & Profile Card */}
      <div className="space-y-4">
        {/* Your Profile Clout Card */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              Your Chirper Presence
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-lg font-black font-mono text-white">
                {followers.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">
                Followers
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
              <div className="text-lg font-black font-mono text-amber-400">
                {streetCred}
              </div>
              <div className="text-[10px] text-slate-400 font-mono uppercase">
                Street Clout
              </div>
            </div>
          </div>
        </div>

        {/* Trending Hashtags */}
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              Trending in Metropolis
            </span>
          </div>

          <div className="space-y-2.5">
            {trendingTopics.map((topic, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="font-bold text-white hover:text-amber-400 cursor-pointer">
                  {topic.tag}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {topic.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
