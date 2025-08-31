"use client";

import { useRef } from "react";
import { useAppContext } from "@/components/provider/app-context";
import "../../styles/custom-style.css";
import { Button } from "../ui/button";
import { toast } from "sonner";
export function RenderHTML() {
  const ref = useRef<HTMLDivElement>(null);
  const { tag } = useAppContext();

  function getContentDivs(html: string) {
    if (!html) return [];
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    // Lấy các div có class content hoặc chứa content
    const divs = Array.from(
      doc.querySelectorAll("div.content, div[class*='content']")
    );
    // Lọc bỏ input type radio và img có class icon trong từng div
    divs.forEach((div) => {
      const radios = div.querySelectorAll('input[type="radio"]');
      radios.forEach((radio) => radio.remove());
      const icons = div.querySelectorAll("img.icon");
      icons.forEach((icon) => icon.remove());
    });
    return divs;
  }

  const contentDivs = tag ? getContentDivs(tag) : [];

  function highlightAnswers() {
    if (!ref.current) return;
    // Lấy tất cả các div.content trong DOM thực tế
    const contentDivs = ref.current.querySelectorAll(
      "div.content, div[class*='content']"
    );
    contentDivs.forEach((contentDiv) => {
      // outcome > rightanswer > span.content
      const outcomeDiv = contentDiv.querySelector("div.outcome.clearfix");
      const rightAnswerDiv = outcomeDiv?.querySelector(".rightanswer");
      let rightText = rightAnswerDiv?.textContent?.trim() || "";
      // Loại bỏ tiền tố 'Câu trả lời đúng là:' nếu có
      rightText = rightText.replace(/^Câu trả lời đúng là:\s*/i, "").trim();
      if (!rightText) return;

      // Tô đậm đáp án đúng
      const answerDivs = contentDiv.querySelectorAll(
        "div.formulation.clearfix div.answer div.d-flex.w-auto"
      );
      answerDivs.forEach((dFlexDiv) => {
        // Tìm flex-fill bên trong
        const flexFill = dFlexDiv.querySelector("div.flex-fill.ml-1");
        if (flexFill) {
          const spanText = flexFill.textContent?.trim();
          if (spanText === rightText) {
            // Có thể tô đậm luôn nếu muốn
            (dFlexDiv as HTMLElement).style.fontWeight = "bold";
            (dFlexDiv as HTMLElement).style.color = "#d32f2f";
          }
          // Thay thế toàn bộ nội dung dFlexDiv bằng text
          dFlexDiv.innerHTML = dFlexDiv.textContent || "";
        }
      });

      // Xóa tất cả outcome.clearfix trong contentDiv
      const outcomes = contentDiv.querySelectorAll("div.outcome.clearfix");
      outcomes.forEach((outcome) => outcome.remove());
    });
  }

  function handleCopy() {
    if (!ref.current) return;
    // Get all content divs
    const contentDivs = ref.current.querySelectorAll(
      "div.content, div[class*='content']"
    );
    let html = "";
    contentDivs.forEach((div) => {
      // Clone node để thao tác
      const clone = div.cloneNode(true) as HTMLElement;
      // Tìm đáp án đúng
      const outcomeDiv = clone.querySelector("div.outcome.clearfix");
      const rightAnswerDiv = outcomeDiv?.querySelector(".rightanswer");
      let rightText = rightAnswerDiv?.textContent?.trim() || "";
      rightText = rightText.replace(/^Câu trả lời đúng là:\s*/i, "").trim();
      // Tìm các đáp án
      const answerDivs = clone.querySelectorAll(
        "div.formulation.clearfix div.answer div.d-flex.w-auto"
      );
      answerDivs.forEach((dFlexDiv) => {
        const flexFill = dFlexDiv.querySelector("div.flex-fill.ml-1");
        if (flexFill) {
          const spanText = flexFill.textContent?.trim();
          if (spanText === rightText) {
            // Đáp án đúng: wrap bằng span có style
            dFlexDiv.innerHTML = `<span style=\"font-weight:bold;color:#d32f2f\">${dFlexDiv.textContent}</span>`;
          } else {
            // Đáp án khác: chỉ giữ text
            dFlexDiv.innerHTML = dFlexDiv.textContent || "";
          }
        }
      });
      // Xóa outcome.clearfix
      clone
        .querySelectorAll("div.outcome.clearfix")
        .forEach((outcome) => outcome.remove());
      html += clone.outerHTML + "<br>";
    });
    // Clean up: remove excessive <br> and empty lines
    html = html.replace(/(<br\s*\/?>\s*){2,}/gi, "<br>");
    // Use Clipboard API to copy as HTML
    if (navigator.clipboard && window.ClipboardItem) {
      const blob = new Blob([html], { type: "text/html" });
      const item = new window.ClipboardItem({ "text/html": blob });
      navigator.clipboard.write([item]).then(() => {
        toast("Đã copy nội dung!", {
          description: (
            <span className="text-gray-700">
              Nội dung đã được lưu vào clipboard
            </span>
          ),
        });
      });
    } else {
      // Fallback: copy as plain text
      navigator.clipboard.writeText(ref.current.innerText).then(() => {
        toast("Đã copy nội dung!", {
          description: (
            <span className="text-gray-700">
              Nội dung đã được lưu vào clipboard
            </span>
          ),
        });
      });
    }
  }

  return (
    <div className="h-full">
      <div className="flex justify-between">
        <Button onClick={handleCopy} className="bg-fuchsia-400 hover:bg-fuchsia-500">
          Copy
        </Button>
        <Button
          className="mb-2 px-4 py-2 rounded bg-blue-500 hover:bg-blue-600"
          onClick={highlightAnswers}
        >
          Tô đậm đáp án đúng
        </Button>
      </div>
      <div className="border h-[calc(100vh-100px)] rounded border-gray-200 overflow-auto shadow">
        <div ref={ref} className="p-2 overflow-hidden">
          {contentDivs.length > 0 ? (
            contentDivs.map((div, idx) => (
              <div
                key={idx}
                dangerouslySetInnerHTML={{ __html: div.outerHTML }}
              />
            ))
          ) : (
            <span className="text-gray-400">
              Chưa có tag nào được nhập hoặc không có div class content.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
