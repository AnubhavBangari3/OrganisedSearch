import React, { useState } from "react";
import { useCookies } from "react-cookie";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

export default function AskChatbot({ fileId, onClose }) {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [token] = useCookies(["access_token"]);

  const handleAskChatbot = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chatbot/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token["access_token"]}`,
        },
        body: JSON.stringify({ message, file_id: fileId }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.response);
      } else {
        setResponse(data.error || "Error getting response");
      }
    } catch (error) {
      setResponse("Failed to reach chatbot server");
    }

    setLoading(false);
  };

  return (
    <Modal open onClose={onClose}>
      <Box sx={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        bgcolor: "white", boxShadow: 24, p: 4, borderRadius: 2
      }}>
        <h2>Ask Chatbot</h2>
        <TextField
          fullWidth
          variant="outlined"
          label="Enter your question"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button
          onClick={handleAskChatbot}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? "Asking..." : "Ask"}
        </Button>
        {response && (
          <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
            <b>Chatbot:</b> {response}
          </Box>
        )}
      </Box>
    </Modal>
  );
}
