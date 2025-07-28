import React, { useState } from "react";
import axios from "axios";

interface UploadFile {
  uid: string;
  name: string;
  type: string;
  size: number;
  originFileObj: File;
}

interface FileInfo {
  name: string;
  type: string;
}

interface UploadFilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  insertFileToken: (
    filename: string,
    metadata: {
      fileId: string;
      path: string;
      mimeType: string;
      size: number;
      owner: string;
    }
  ) => void;
}

const UploadFilePopup: React.FC<UploadFilePopupProps> = ({
  isOpen,
  onClose,
  insertFileToken,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  // const [fileInfo, setFileInfo] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const maxSize = 2 * 1024 * 1024; // 2MB
    const newFiles: UploadFile[] = [];
    const newFileInfo: FileInfo[] = [];

    Array.from(selectedFiles).forEach((file) => {
      if (file.size <= maxSize) {
        const uid = Math.random().toString(36).substring(2, 15);
        newFiles.push({
          uid,
          name: file.name,
          type: file.type,
          size: file.size,
          originFileObj: file,
        });

        newFileInfo.push({
          name: file.name,
          type: file.type,
        });
      } else {
        // toast({
        //   title: "Error",
        //   description: `File ${file.name} exceeds the 2MB limit`,
        //   variant: "destructive",
        // });
      }
    });

    setFiles((prev) => [...prev, ...newFiles]);
    // setFileInfo((prev) => [...prev, ...newFileInfo]);
  };

  const removeFile = (fileToRemove: UploadFile) => {
    setFiles((prev) => prev.filter((file) => file.uid !== fileToRemove.uid));
    // setFileInfo((prev) =>
    //   prev.filter((info) => info.name !== fileToRemove.name)
    // );
  };

  const onSubmit = async () => {
    if (files.length === 0) {
      // toast({
      //   title: "Error",
      //   description: t("chat.documentModal.please_upload_file"),
      //   variant: "destructive",
      // });
      return;
    }

    setLoading(true);
    try {
      const url =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://ecoapilwebapp02-ash2f8e6fcgzexgq.centralindia-01.azurewebsites.net/api";
      const csrf = await axios.get(`${url}/v1/get-csrf-token`);
      const data = new FormData();

      files.forEach((file) => {
        data.append("file", file.originFileObj);
      });

      // const userDetails = Cookies.get("EchoAIuserDetails");
      const parsedDetails = localStorage.getItem("access_token");

      const fileresponse = await axios.post(
        `${url}/v2/file-manager/files`,
        data,
        {
          headers: {
            "X-CSRF-Token": csrf.data.csrf_token,
            Accept: "application/json",
            Authorization: `Bearer ${parsedDetails}`,
          },
        }
      );

      if (fileresponse) {
        const uploadedFiles = fileresponse.data.data.results;

        for (let i = 0; i < uploadedFiles.length; i++) {
          const file = uploadedFiles[i];
          await new Promise((resolve) => setTimeout(resolve, 50));

          insertFileToken(file.filename, {
            fileId: file.id,
            path: file.file_path,
            mimeType: file.mime_type,
            size: file.file_size,
            owner: file.user_id,
          });
        }

        // toast({
        //   title: "Success",
        //   description: `${uploadedFiles.length} file(s) uploaded and added to chat`,
        // });

        // setFileInfo([]);
        setFiles([]);
        onClose();
      }
    } catch (err) {
      console.error(err);
      // toast({
      //   title: "Error",
      //   description: t("chat.documentModal.file_upload_error"),
      //   variant: "destructive",
      // });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Upload Files</h2>
        <input type="file" multiple onChange={handleFileChange} />
        <ul className="my-4 space-y-2 max-h-40 overflow-auto">
          {files.map((file) => (
            <li
              key={file.uid}
              className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded"
            >
              <span>{file.name}</span>
              <button
                onClick={() => removeFile(file)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFilePopup;
