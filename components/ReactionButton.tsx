import { supabase } from "@/lib/supabase";
const emojis = ["👍", "🎉", "😂", "😮", "❤️"];
export default function Reactions({ postId }: { postId: string }) {
  async function react(emoji: string) {
    await supabase.from("reactions").insert({ post_id: postId, emoji });
  }
  return (
    <div className="flex space-x-2 mt-2">
      {emojis.map((e) => (
        <button key={e} onClick={() => react(e)} className="text-2xl">{e}</button>
      ))}
    </div>
  );
}
 