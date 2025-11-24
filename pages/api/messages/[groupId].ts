import type { NextApiRequest, NextApiResponse } from "next";
import createApiClient from "@/utils/supabase/clients/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createApiClient(req, res);
  const { groupId } = req.query;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    const { data: messages, error } = await supabase
      .from("messages")
      .select(
        `
        *,
        author:users!author_id(id, name, avatar_url)
      `
      )
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(messages);
  } else if (req.method === "POST") {
    const { message, attachment_url } = req.body;

    if (!message && !attachment_url) {
      return res
        .status(400)
        .json({ error: "Message or attachment required" });
    }

    const { data, error } = await supabase
      .from("messages")
      .insert({
        group_id: parseInt(groupId as string),
        author_id: user.id,
        message,
        attachment_url,
      })
      .select(
        `
        *,
        author:users!author_id(id, name, avatar_url)
      `
      )
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json(data);
  } else if (req.method === "DELETE") {
    const { messageId } = req.body;

    const { data: message, error: fetchError } = await supabase
      .from("messages")
      .select("author_id")
      .eq("id", messageId)
      .single();

    if (fetchError || !message) {
      return res.status(404).json({ error: "Message not found" });
    }

    if (message.author_id !== user.id) {
      return res
        .status(403)
        .json({ error: "You can only delete your own messages" });
    }

    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
