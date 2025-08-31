"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAppContext } from "@/components/provider/app-context";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const FormSchema = z.object({
  bio: z.string().min(1, {
    message: "Phải có ít nhất 1 thẻ",
  }),
});
export default function InputTag() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const { setTag } = useAppContext();

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setTag(data.bio);
    toast("Bạn đã nhập tag", {
      description: (
        <pre className="mt-2 w-[320px] rounded-md bg-neutral-950 p-4">
          <code className="text-white">{data.bio}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full h-full space-y-6 p-2"
      >
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="gap-1">
              <FormLabel className="h-8">Nhập thẻ:</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Nhập các tag"
                  className="w-full max-h-[calc(100vh-150px)] border"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Liên hệ <span>&quot;mhphuc.98@gmail.com&quot;</span> để hướng dẫn sử dụng.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" className="bg-green-500 hover:bg-green-600">Ok</Button>
        </div>
      </form>
    </Form>
  );
}
