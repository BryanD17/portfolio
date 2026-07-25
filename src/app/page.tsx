import { Terminal } from "@/components/ui/Terminal";
import { Prompt } from "@/components/ui/Prompt";
import { Cursor } from "@/components/ui/Cursor";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-4">
      <Terminal className="w-full">
        <p>
          <Prompt />
          <span className="text-fg">whoami</span>
        </p>
        <p className="text-fg-muted">Bryan Djenabia Joseph</p>
        <p className="text-fg-subtle"># site under construction, hero lands in agent 06</p>
        <p>
          <Prompt />
          <Cursor />
        </p>
      </Terminal>
    </main>
  );
}
