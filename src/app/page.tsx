
import { AppProvider } from "@/components/provider/app-provider";
import { RenderHTML } from "@/components/render-html/render-html";
import InputTag from "@/components/text-area/input-tag";
import { Toaster } from "@/components/ui/sonner";





export default function Home() {
  return (
    <AppProvider>
      <main className="w-full h-full p-2 overflow-hidden">
        <div className="grid grid-cols-2 h-full">
          <InputTag />
          <RenderHTML />
        </div>
      </main>
      <Toaster />
    </AppProvider>
  );
}
