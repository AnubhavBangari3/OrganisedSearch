import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Typography, Paper } from "@mui/material";

export default function AskQuestionModal({ fileId, onClose }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token] = useCookies(["access_token"]);

  const handleAskQuestion = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/ask/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token["access_token"]}`,
        },
        body: JSON.stringify({ question, file_id: fileId }),
      });

      if (!response.ok) throw new Error("Failed to get answer");

      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error asking question:", error);
    }
    setLoading(false);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ask a Question</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Enter your question..."
          variant="outlined"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          margin="dense"
        />
        {loading && <CircularProgress size={24} sx={{ marginTop: 2 }} />}
        {answer && (
          <Paper elevation={3} sx={{ padding: 2, marginTop: 2, backgroundColor: "#f5f5f5" }}>
            <Typography variant="subtitle1"><strong>Answer:</strong></Typography>
            <Typography variant="body1">{answer}</Typography>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Close</Button>
        <Button onClick={handleAskQuestion} color="primary" variant="contained" disabled={loading}>
          {loading ? "Getting Answer..." : "Ask"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
