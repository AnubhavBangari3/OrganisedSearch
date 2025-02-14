import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import Main from './Main'

export default function FilePage() {

          const { id } = useParams(); // Get file ID from URL
          const [fileData, setFileData] = useState("");
          const searchQuery = localStorage.getItem("searchQuery") || ""; // Get stored search text
           const [token] = useCookies(["access_token"]); // Authentication token

          useEffect(() => {
          const fetchFile = async () => {
          try {
          const response = await fetch(`http://127.0.0.1:8000/file/${id}/`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json",
                              Authorization: `Bearer ${token["access_token"]}`,
                    },
          });

          if (!response.ok) throw new Error("Failed to fetch file");

          const data = await response.json();
          console.log("dta:",data)
          setFileData(data.content);

          // Wait for content to render before triggering search
          setTimeout(() => {
                    if (searchQuery) {
                    window.find(searchQuery);
                    }
          }, 500);
          } catch (error) {
          console.error("Error fetching file:", error);
          }
          };

          fetchFile();
          }, [id]);
       

  return (
    <div><Main/>
    <h2>File ID: {id}</h2>
      <pre style={{ whiteSpace: "pre-wrap" }}>{fileData}</pre>
      {searchQuery}
      </div>
  )
}
