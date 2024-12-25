"use client";

import React, { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";
import "highlight.js/styles/atom-one-dark.min.css";
import hljs from "highlight.js";
import Quill from "quill";
import quillParser from "quilljs-parser";

const QuillEditor = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const toolbarRef = useRef<HTMLDivElement | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [preview, setPreview] = useState<
    quillParser.ParsedQuillDelta | undefined
  >();

  useEffect(() => {
    if (editorRef.current && toolbarRef.current && !quill) {
      const quillInstance = new Quill(editorRef.current, {
        modules: {
          syntax: {
            hljs,
          },
          toolbar: toolbarRef.current,
        },
        placeholder: "Compose an epic...",
        theme: "snow",
      });

      setQuill(quillInstance);
    }
  }, [quill]);

  useEffect(() => {
    if (quill) {
      const handler = () => {
        const contents = quill.getContents();
        const parsedQuill = quillParser.parseQuillDelta(contents);
        setPreview(parsedQuill);
      };
      quill.on("text-change", handler);
      return () => {
        quill.off("text-change", handler);
      };
    }
  }, [quill]);

  return (
    <div className="w-full">
      <div>
        <button onClick={() => console.log(quill?.getContents())}>LOG</button>
        <button onClick={() => console.log(preview)}>Preview</button>
      </div>
      <div id="toolbar-container" ref={toolbarRef}>
        <span className="ql-formats">
          <select className="ql-font"></select>
          <select className="ql-size"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-underline"></button>
          <button className="ql-strike"></button>
        </span>
        <span className="ql-formats">
          <select className="ql-color"></select>
          <select className="ql-background"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-script" value="sub"></button>
          <button className="ql-script" value="super"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-header" value="1"></button>
          <button className="ql-header" value="2"></button>
          <button className="ql-blockquote"></button>
          <button className="ql-code-block"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
          <button className="ql-indent" value="-1"></button>
          <button className="ql-indent" value="+1"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-direction" value="rtl"></button>
          <select className="ql-align"></select>
        </span>
        <span className="ql-formats">
          <button className="ql-link"></button>
          <button className="ql-image"></button>
          <button className="ql-video"></button>
          <button className="ql-formula"></button>
        </span>
        <span className="ql-formats">
          <button className="ql-clean"></button>
        </span>
      </div>

      <div
        ref={editorRef}
        id="editor"
        style={{ height: "100%", width: "100%", minHeight: "400px" }}
      ></div>
      <div>
        <h2>Preview</h2>
        <pre>
          <code>{JSON.stringify(preview, null, 2)}</code>
        </pre>
      </div>
      <h2>CONSTRUCTED PREVIEW</h2>
      <div className="text-black flex flex-wrap border-[2px] relative">
        {preview?.paragraphs?.map((paragraph, idx) => {
          const textRun = paragraph.textRuns as ParagraphType[];
          const attributes = paragraph?.attributes || {};

          const headerStyles = {
            1: "33px",
            2: "25px",
            3: "15px",
          };

          return (
            <span
              key={`paragraph-${idx}`}
              style={{
                width: "100%",
                border: "1px solid red",
                fontSize:
                  headerStyles[
                    attributes?.header as keyof typeof headerStyles
                  ] || headerStyles[3],
                textAlign: attributes?.align || "left",
              }}
            >
              {parseQuillText(textRun)}
            </span>
          );
        })}
      </div>
    </div>
  );
};

type ParagraphType = quillParser.TextRun;

function parseQuillText(textRuns: ParagraphType[]) {
  return (
    <React.Fragment>
      {textRuns?.map((textRun, idx) => {
        const text = textRun?.text;
        const attributes = textRun?.attributes || {};

        return (
          <React.Fragment key={`text-run-${idx}-${text}`}>
            <span
              style={{
                textWrap: "wrap",
                fontWeight: attributes?.bold ? "bold" : "normal",
                fontStyle: attributes?.italic ? "italic" : "normal",
                textDecoration: attributes?.underline
                  ? "underline"
                  : attributes?.strike
                  ? "line-through"
                  : "none",
                color: attributes?.color || "inherit",
                backgroundColor: attributes?.background || "transparent",
              }}
            >
              {text}
            </span>
          </React.Fragment>
        );
      })}
      <br />
    </React.Fragment>
  );
}

export default QuillEditor;
