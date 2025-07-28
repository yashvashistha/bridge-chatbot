import Image from "next/image";
// import { useTranslation } from "react-i18next";
import { ChatInputProps } from "../types/chat-wedgit-types";

import { Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const secondryOptions = [
  "What is GAMI?",
  "Key initiatives?",
  "Partnership process?",
];

type FolderItem = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  owner: string;
  parent_id: string | null;
};

type FileItem = {
  id: string;
  filename: string;
  mime_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  owner: string;
  is_folder: boolean;
  parent_id: string | null;
  status: string;
  file_path: string;
};

export const ChatInput = ({
  input,
  setInput,
  sendMessage,
  showSecondryOptions,
  isLoading,
}: //   isOpen,
ChatInputProps) => {
  //   const { t } = useTranslation();

  const inputRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const [activeCommand, setActiveCommand] = useState("");
  //   const [highlightedIndex, setHighlightedIndex] = useState(0);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      if (inputRef.current) {
        inputRef.current.innerHTML = "";
        inputRef.current.dataset.empty = "true";
      }
      setInput("");
    }
  };

  const detectCommand = () => {
    const text = inputRef.current?.textContent || "";
    const fileMatch = text.match(/^\/file:$/);

    if (fileMatch) {
      setActiveCommand("file");
      setShowCommandMenu(true);
      fetchFilesAndFolders();
    } else {
      setShowCommandMenu(false);
      setActiveCommand("");
    }
  };

  //   const insertFileToken = (filename: string, metadata: any) => {
  //     if (!inputRef.current) return;

  //     const input = inputRef.current;
  //     const placeholder = document.createElement("span");
  //     placeholder.id = "file-token-placeholder";

  //     let replaced = false;

  //     // Safely walk through childNodes (which include both Text and Element nodes)
  //     const nodes = Array.from(input.childNodes);
  //     for (const node of nodes) {
  //       if (node.nodeType === Node.TEXT_NODE && !replaced) {
  //         const textNode = node as Text;
  //         const index = textNode.textContent?.indexOf("/file:");
  //         if (index !== -1) {
  //           const beforeText = textNode.textContent?.substring(0, index) || "";
  //           const afterText = textNode.textContent?.substring(index + 6) || "";

  //           const beforeNode = document.createTextNode(beforeText);
  //           const afterNode = document.createTextNode(afterText);

  //           input.insertBefore(beforeNode, textNode);
  //           input.insertBefore(placeholder, textNode);
  //           input.insertBefore(afterNode, textNode);
  //           input.removeChild(textNode);

  //           replaced = true;
  //           break;
  //         }
  //       }
  //     }

  //     // Create token
  //     const token = document.createElement("span");
  //     token.className =
  //       "token-span inline-flex items-center gap-1 px-2 py-0.5 mr-1 rounded-md text-xs font-medium bg-green-200 text-green-800 border border-green-300";
  //     token.contentEditable = "false";
  //     token.setAttribute("data-type", "file");
  //     token.setAttribute("data-value", filename);
  //     token.setAttribute("data-metadata", JSON.stringify(metadata));
  //     token.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V7.5L14.5 2z"></path></svg> <span class="select-none">${filename}</span>`;

  //     const space = document.createTextNode(" ");

  //     // Insert token in place of placeholder
  //     const placeholderElement = document.getElementById(
  //       "file-token-placeholder"
  //     );
  //     if (placeholderElement && placeholderElement.parentNode) {
  //       placeholderElement.parentNode.replaceChild(token, placeholderElement);
  //       token.parentNode?.insertBefore(space, token.nextSibling);
  //     } else {
  //       // fallback: insert at the end
  //       input.appendChild(token);
  //       input.appendChild(space);
  //     }

  //     // Move caret after the space node
  //     const sel = window.getSelection();
  //     const newRange = document.createRange();
  //     newRange.setStartAfter(space);
  //     newRange.collapse(true);
  //     if (sel) {
  //       sel.removeAllRanges();
  //       sel.addRange(newRange);
  //     }

  //     setShowCommandMenu(false);
  //     setActiveCommand("");
  //     setInput(getPlainText());
  //   };

  const insertFileToken = (filename: string, metadata: any) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const placeholder = document.createElement("span");
    placeholder.id = "file-token-placeholder";

    let replaced = false;

    // Safely walk through childNodes (Text + Elements)
    const nodes = Array.from(input.childNodes);
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE && !replaced) {
        const textNode = node as Text;
        const text = textNode.textContent;

        if (text && text.includes("/file:")) {
          const index = text.indexOf("/file:");

          const beforeText = text.substring(0, index);
          const afterText = text.substring(index + 6);

          const beforeNode = document.createTextNode(beforeText);
          const afterNode = document.createTextNode(afterText);

          input.insertBefore(beforeNode, textNode);
          input.insertBefore(placeholder, textNode);
          input.insertBefore(afterNode, textNode);
          input.removeChild(textNode);

          replaced = true;
          break;
        }
      }
    }

    // Create the token span
    const token = document.createElement("span");
    token.className =
      "token-span inline-flex items-center gap-1 px-2 py-0.5 mr-1 rounded-md text-xs font-medium bg-green-200 text-green-800 border border-green-300";
    token.contentEditable = "false";
    token.setAttribute("data-type", "file");
    token.setAttribute("data-value", filename);
    token.setAttribute("data-metadata", JSON.stringify(metadata));
    token.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V7.5L14.5 2z"></path></svg> <span class="select-none">${filename}</span>`;

    const space = document.createTextNode(" ");

    // Insert token at placeholder
    const placeholderElement = document.getElementById(
      "file-token-placeholder"
    );
    if (placeholderElement && placeholderElement.parentNode) {
      placeholderElement.parentNode.replaceChild(token, placeholderElement);
      token.parentNode?.insertBefore(space, token.nextSibling);
    } else {
      input.appendChild(token);
      input.appendChild(space);
    }

    // Place cursor after the space node
    const sel = window.getSelection();
    const newRange = document.createRange();
    newRange.setStartAfter(space);
    newRange.collapse(true);
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(newRange);
    }

    setShowCommandMenu(false);
    setActiveCommand("");
    setInput(getPlainText());
  };

  const url =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://ecoapilwebapp02-ash2f8e6fcgzexgq.centralindia-01.azurewebsites.net/api";

  const getCSRFtoken = async () => {
    try {
      const response = await axios.get(`${url}/v1/get-csrf-token`);
      return response.data.csrf_token;
    } catch (err) {
      console.error("Error in CSRF Token", err);
      return "";
    }
  };

  const buildQueryString = (params: Record<string, any>) => {
    const esc = encodeURIComponent;
    return Object.entries(params)
      .filter(([, v]) => v !== undefined && v !== null && v !== "")
      .map(([k, v]) => `${esc(k)}=${esc(v)}`)
      .join("&");
  };

  const GetFile = async (
    id: string | null = null,
    page: number,
    limit: number
  ) => {
    try {
      const csrf = await getCSRFtoken();
      const endpoint =
        id == null
          ? `v2/file-manager/user/file-system?${buildQueryString({
              page,
              page_size: limit,
            })}`
          : `v2/file-manager/user/${id}/tree?${buildQueryString({
              page,
              page_size: limit,
            })}`;

      const config = {
        method: "get",
        maxBodyLength: Number.POSITIVE_INFINITY,
        url: `${url}/${endpoint}`,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          ...(csrf ? { "X-CSRF-Token": csrf } : {}),
          ...(localStorage.getItem("access_token")
            ? {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              }
            : {}),
        },
      };
      const response = await axios.request(config);
      console.log("Files fetched successfully:", response.data);
      // Only wrap in array if consumer expects it; otherwise, return as is
      if (!id && response.status && response?.data?.data?.result)
        return { status: 1, data: response?.data?.data?.result, msg: "" };
      else if (id && response.status && response?.data?.data?.result)
        return { status: 1, data: [response?.data?.data?.result], msg: "" };
      return { status: 0, data: [], msg: "No data found" };
    } catch (err) {
      console.error("Error while Fetching Files", err);
      return { status: 0, data: [], msg: "Error while Fetching Files" };
    }
  };

  const fetchFilesAndFolders = async () => {
    setIsLoadingFiles(true);
    setFileError(null);

    try {
      const response = await GetFile(currentFolderId, 1, 100);
      setFolders([]);
      setFiles([]);

      const collectedFolders: FolderItem[] = [];
      const collectedFiles: FileItem[] = [];

      const parseItems = (items: any[], parentId: string | null = null) => {
        items.forEach((item) => {
          if (
            item.type == "folder" &&
            item.id !== "root" &&
            currentFolderId !== item.id
          ) {
            collectedFolders.push({
              id: item.id,
              name: item.name,
              created_at: item.created_at || new Date().toISOString(),
              updated_at: item.updated_at || new Date().toISOString(),
              owner: item.updated_by,
              parent_id: parentId,
            });
          } else if (
            item.name !== "Root" &&
            item.id !== "root" &&
            item.type == "file"
          ) {
            collectedFiles.push({
              id: item.id,
              filename: item.name,
              mime_type: item.mime_type || "file",
              file_size: item.size || 0,
              created_at: item.created_at,
              updated_at: item.updated_by,
              owner: item.updated_by,
              is_folder: false,
              parent_id: item.parent_id,
              file_path: item.file_path || `/${item.name}`,
              status: "completed",
            });
          } else if (item?.children?.length > 0) {
            parseItems(item.children, item.id);
          }
        });
      };

      if (currentFolderId) {
        parseItems(response.data[0].tree.children);
      } else {
        parseItems(response.data.items);
      }

      setFolders(collectedFolders);
      setFiles(collectedFiles);
    } catch (err) {
      setFileError("Failed to load files.");
      console.error("Error fetching files and folders:", err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const getPlainText = (): string => {
    if (!inputRef.current) return "";

    const clone = inputRef.current.cloneNode(true) as HTMLElement;
    const tokenSpans = clone.querySelectorAll(".token-span");

    tokenSpans.forEach((span) => {
      const type = span.getAttribute("data-type");
      const value = span.getAttribute("data-value") || "";
      const metadata = JSON.parse(span.getAttribute("data-metadata") || "{}");

      // For file tokens, use the formatted string with filename and filepath
      if (type === "file") {
        const filename = value;
        const filepath = metadata.path || `/${filename}`;
        const formattedText = `[filename: ${filename}. filepath: ${filepath}]`;
        const textNode = document.createTextNode(formattedText);
        span.parentNode?.replaceChild(textNode, span);
      } else {
        const textNode = document.createTextNode(value);
        span.parentNode?.replaceChild(textNode, span);
      }
    });

    return clone.textContent || "";
  };

  useEffect(() => {
    if (input.trim().endsWith("/file:")) {
      setActiveCommand("file");
      setShowCommandMenu(true);
      fetchFilesAndFolders();
    } else {
      setShowCommandMenu(false);
    }
  }, [input]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const text = el.textContent ?? "";
    el.dataset.empty = text.trim() === "" ? "true" : "false";

    // If it starts with `/file:` but has extra text after it, remove the command
    const fileCommandMatch = text.match(/^\/file:(.+)/);
    if (fileCommandMatch) {
      const afterCommand = fileCommandMatch[1].trim();
      if (afterCommand.length > 0) {
        // Replace the content by removing `/file:` and keeping the rest
        const newText = afterCommand;
        el.textContent = newText;
        setShowCommandMenu(false);
        setActiveCommand("");
      }
    }

    detectCommand(); // to re-trigger detection for updated content
    setInput(getPlainText());
  };

  return (
    <div className="flex flex-col p-3 gap-2 bg-[#FFFFFF]">
      {showCommandMenu && activeCommand === "file" && (
        <div className="absolute bg-white border shadow-md rounded-md z-10  max-h-60 overflow-auto mt-1 bottom-[110px]">
          {isLoadingFiles ? (
            <div className="p-2 text-sm text-gray-500">Loading files...</div>
          ) : fileError ? (
            <div className="p-2 text-sm text-red-500">{fileError}</div>
          ) : (
            <>
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  onClick={() => setCurrentFolderId(folder.id)}
                >
                  📁 {folder.name}
                </div>
              ))}
              {files.map((file) => (
                <div
                  key={file.id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
                  onClick={() =>
                    insertFileToken(file.filename, {
                      fileId: file.id,
                      path: file.file_path,
                      size: file.file_size,
                      mimeType: file.mime_type,
                    })
                  }
                >
                  📄 {file.filename}
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {showSecondryOptions && (
        <div className="flex gap-1 p-1">
          {secondryOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => sendMessage(option)}
              className="w-fit text-xs bg-[#EFF1F1] text-[#000000] p-2 rounded-lg"
            >
              {option}
            </button>
          ))}
        </div>
      )}
      <div className="flex max-h-[10dvh] items-center relative bg-[#EFF1F1] border-[.5px] border-[#E4E7E7] rounded-2xl overflow-hidden px-2 gap-2">
        <button
          // onClick={() => setOpenUploadFileModal(true)}
          className="rounded-full h-9 w-9"
        >
          <Upload className="h-4 w-4 text-black" />
        </button>

        <div
          ref={inputRef}
          contentEditable={true}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          //   onPaste={handlePaste}
          className={`relative content-editable min-h-[60px] max-h-[120px] overflow-auto w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-2 pr-24 text-black ${
            false ? "pointer-events-none opacity-50" : ""
          }`}
          data-placeholder="Type a message or use / for commands"
          data-empty="true"
          suppressContentEditableWarning
          style={{
            lineHeight: "1.5",
            wordBreak: "break-word",
          }}
        />
        <button
          className={`${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          onClick={() => sendMessage()}
        >
          <Image
            src="/assets/send.svg"
            alt="chat icon"
            width={24}
            height={24}
          />
        </button>
      </div>
    </div>
  );
};
