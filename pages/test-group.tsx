import { MessageBoard } from "@/components/notes/MessageBoard";

/**
 * Test page to view the notes board without authentication
 * Visit: http://localhost:3000/test-group
 */
export default function TestGroupPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">COMP 426 group chats</h1>
        <p className="mt-2 text-muted-foreground">Test group for notes board</p>
      </div>

      <div className="grid gap-6">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Shared Notes Board</h2>
          <MessageBoard groupId={1} />
        </div>
      </div>
    </div>
  );
}
