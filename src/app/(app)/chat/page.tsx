import { requireAuth } from "@/lib/session";
import { prisma } from "@/lib/db/prisma";
import { ChatInterface } from "@/components/chat/ChatInterface";

export default async function ChatPage() {
  const session = await requireAuth();

  const messages = await prisma.chatMessage.findMany({
    where: {
      userId: session.user.id,
      role: { in: ["user", "assistant"] },
    },
    orderBy: { createdAt: "asc" },
    take: 50,
  });

  const serialized = messages.map((m) => ({
    id: m.id,
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return (
    <div className="max-w-3xl mx-auto">
      <ChatInterface initialMessages={serialized} />
    </div>
  );
}
