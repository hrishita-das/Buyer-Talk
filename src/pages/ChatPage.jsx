import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const socket = io("http://localhost:5000");

const ChatPage = () => {
  const { register, handleSubmit, reset } = useForm();
  const [messages, setMessages] = useState([]);
  const [showDelete, setShowDelete] = useState(null);
  const userName = localStorage.getItem("userName") || "User";
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data))
      .catch((err) => console.error("Error fetching messages:", err));
  }, []);

  useEffect(() => {
    socket.on("receiveMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  const sendMessage = async (data) => {
    if (data.message.trim()) {
      const newMessage = {
        sender: userName,
        text: data.message,
        timestamp: new Date(),
        status: "sent", // Default status
      };

      socket.emit("sendMessage", newMessage);
      reset();
    }
  };

  const deleteMessage = (index) => {
    setMessages(messages.filter((_, i) => i !== index));
    setShowDelete(null);
  };

  return (
    <div className="container-fluid vh-100 d-flex flex-column" style={{ background: "#2c3e50" }}>
      <div className="row flex-grow-1">
        {/* Sidebar */}
        <div className="col-md-3 bg-dark text-white p-3 border-end d-flex flex-column shadow-sm">
          <div className="d-flex align-items-center p-3 mb-3 bg-secondary text-white rounded">
            <i className="fas fa-user-circle fa-2x me-2"></i>
            <div>
              <h6 className="mb-0 fw-bold">{userName}</h6>
              <small>Online</small>
            </div>
          </div>
          <button className="btn btn-secondary mt-auto" onClick={() => navigate(-1)}>
            <i className="fas fa-arrow-left me-2"></i> Back
          </button>
        </div>

        {/* Chat Window */}
        <div className="col-md-9 d-flex flex-column">
          <div className="flex-grow-1 p-3 overflow-auto border-bottom" style={{ maxHeight: "80vh", background: "#34495e" }}>
            {messages.map((msg, index) => (
              <div key={index} className={`d-flex mb-2 ${msg.sender === userName ? "justify-content-end" : "justify-content-start"}`}>
                <div className={`p-3 rounded shadow-sm ${msg.sender === userName ? "bg-primary text-white" : "bg-light border"}`} 
                  style={{ maxWidth: "70%", borderRadius: "15px", padding: "10px 15px", position: "relative" }}>
                  
                  <div className="d-flex justify-content-between">
                    <small className="fw-bold">{msg.sender}</small>
                    <button className="btn btn-sm text-white" onClick={() => setShowDelete(index === showDelete ? null : index)}>
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </div>
                  <p className="mb-1" style={{ fontSize: "14px" }}>{msg.text}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted" style={{ fontSize: "12px" }}>{new Date(msg.timestamp).toLocaleTimeString()}</small>
                    <small className="text-light">
                      {msg.status === "read" ? <i className="fas fa-check-double"></i> : <i className="fas fa-check"></i>}
                    </small>
                  </div>
                  {showDelete === index && (
                    <button className="btn btn-sm btn-danger mt-1" onClick={() => deleteMessage(index)}>Delete</button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Field */}
          <div className="p-3 d-flex align-items-center bg-dark border-top shadow-sm" style={{ borderRadius: "0 0 15px 15px" }}>
            <form className="d-flex w-100" onSubmit={handleSubmit(sendMessage)}>
              <input type="text" className="form-control me-2 rounded-pill" placeholder="Type a message..." {...register("message", { required: true })} style={{ padding: "10px" }} />
              <button className="btn btn-primary rounded-circle" type="submit" style={{ width: "45px", height: "45px" }}>
                <i className="fas fa-paper-plane"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;