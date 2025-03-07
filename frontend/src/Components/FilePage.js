import React, { useState, useEffect, useRef } from "react";
import { useCookies } from "react-cookie";
import { useParams } from "react-router-dom";
import Main from "./Main";
import AskQuestionModal from "./AskQuestionModal";
import AskChatbot from "./AskChatbot"; 
import Button from '@mui/material/Button';

import { Card, CardContent, Typography } from "@mui/material";

export default function FilePage() {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [fileData, setFileData] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);
  const searchQuery = localStorage.getItem("searchQuery") || "";
  const [token] = useCookies(["access_token"]);
  const highlightRefs = useRef([]);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/file/${id}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token["access_token"]}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch file");

        const data = await response.json();
        setFileType(data.file_name.split(".").pop().toLowerCase());
        setFileData(data.file_content);
        setFileName(data.file_name);

        if (searchQuery.trim() && typeof data.file_content === "string") {
          highlightSearch(data.file_content, searchQuery);
        }
      } catch (error) {
        console.error("Error fetching file:", error);
      }
    };

    fetchFile();
  }, [id]);

  const highlightSearch = (text, query) => {
    if (!query.trim()) return;

    highlightRefs.current = []; // Reset refs

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");

    const highlightedText = text.split(regex).map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span
            key={index}
            ref={(el) => {
              if (el) highlightRefs.current.push(el); // Store only non-null elements
            }}
            className="highlighted-match"
          >
            {part}
          </span>
        );
      }
      return part;
    });

    setFileData(highlightedText);
  };

  useEffect(() => {
    setMatches(highlightRefs.current);
    if (highlightRefs.current.length > 0) {
      scrollToMatch(0);
    }
  }, [fileData]); // Update matches after setting fileData

  console.log("matches all:", matches);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter" && matches.length > 0) {
        const nextIndex = (currentMatch + 1) % matches.length;
        console.log("nextIndex for enter:", nextIndex);
        setCurrentMatch(nextIndex);
        scrollToMatch(nextIndex);
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [matches, currentMatch]);

  const scrollToMatch = (index) => {
    if (!matches.length) return;

    const matchElement = matches[index];

    if (matchElement) {
      matchElement.scrollIntoView({ behavior: "smooth", block: "center" });

      matches.forEach((el) => el.classList.remove("active-match"));
      matchElement.classList.add("active-match");
    }
  };

  return (
    <div>
      <Main />

      <Typography variant="h5" className="search-query">
        <b>Search Query: {searchQuery}</b>
      </Typography>
      <Typography variant="body1" className="search-instructions">
        Press <span className="highlight">Enter</span> to navigate through matches!
      </Typography>
      <div className="action-buttons">
        <Button variant="contained" color="secondary" onClick={() => setShowModal(true)}>
          Ask a Question
        </Button>

        <Button variant="contained" color="primary" onClick={() => setShowChatbot(true)}>
          Ask Chatbot
        </Button>

        {showModal && <AskQuestionModal fileId={id} onClose={() => setShowModal(false)} />}
        {showChatbot && <AskChatbot fileId={id} onClose={() => setShowChatbot(false)} />}
      </div>
      

      <Card className="file-card">
        <CardContent>
          <Typography variant="h4" className="file-title">
            {fileName.split("/").pop()}
          </Typography>
          <pre className="file-content">{fileData}</pre>
        </CardContent>
      </Card>

      <style>
        {`
          .highlighted-match {
            background-color: yellow;
            padding: 2px;
            border-radius: 3px;
          }
          .active-match {
            background-color: orange !important;
            outline: 2px solid red;
          }
        `}
      </style>
    </div>
  );
}
