"use client";
import Editor from "@/modules/editor/views/ui/editor";
import { useParams } from "next/navigation";

export default function DocumentPageView() {
  const params = useParams();
  const documentId = params.documentId;
  const pageId = params.id;

  return (
    <div>
      {/* <h1 className="text-xl font-bold sm:text-3xl md:text-4xl sm:mt-10 mb-6">
        Test Document
      </h1> */}
      <Editor id={documentId as string} />
    </div>
  );
}
