import React, { useState, useEffect } from "react";
import axios from "axios";

function Messages() {
    const [messages, setMessages] = useState([]);
    const [replies, setReplies] = useState({});
    const [statusMessage, setStatusMessage] = useState("");
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("userId") || "";

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get("https://reloop-backend.onrender.com/messages", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(response.data);
            } catch (err) {
                setStatusMessage("Unable to load messages.");
                console.error(err);
            }
        };

        fetchMessages();
    }, [token]);

    const groupedMessages = messages.reduce((acc, msg) => {
        const users = [
            String(msg.sender?._id),
            String(msg.receiver?._id)
        ].sort();

        const key = `${users[0]}-${users[1]}-${msg.productId?._id}`;

        if (!acc[key]) {
            const otherUser = String(msg.sender?._id) === String(currentUser)
                ? msg.receiver
                : msg.sender;

            acc[key] = {
                key: key,
                person: otherUser,
                product: msg.productId,
                messages: []
            };
        }

        acc[key].messages.push(msg);
        return acc;
    }, {});

    Object.values(groupedMessages).forEach((group) => {
        group.messages.sort((a, b) => {
            const aDate = new Date(a.createdAt || a.timestamp || 0);
            const bDate = new Date(b.createdAt || b.timestamp || 0);
            return aDate - bDate;
        });
    });

    const handleReplyChange = (groupKey, value) => {
        setReplies(prev => ({
            ...prev,
            [groupKey]: value
        }));
    };

    const handleReply = async (group) => {
        const currentReplyText = (replies[group.key] || "").trim();
        if (!currentReplyText) {
            setStatusMessage("Please enter a reply before sending.");
            return;
        }

        try {
            const response = await axios.post(
                "https://reloop-backend.onrender.com/messages/reply",
                {
                    message: currentReplyText,
                    senderId: group.person?._id,
                    productId: group.product?._id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setStatusMessage(response.data.successMessage || "Reply sent successfully.");
            setReplies(prev => ({
                ...prev,
                [group.key]: ""
            }));

            const res = await axios.get("https://reloop-backend.onrender.com/messages", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
        } catch (err) {
            setStatusMessage(err.response?.data?.message || "Unable to send reply.");
            console.error(err);
        }
    };

    const formatDate = (value) => {
        const date = new Date(value || Date.now());
        if (Number.isNaN(date.getTime())) {
            return "Unknown date";
        }
        return date.toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }
        );
    };

    const handleDelete = async (group) => {
        try {
            await axios.delete("https://reloop-backend.onrender.com/messages/conversation", {
                headers: { "Authorization": `Bearer ${token}` },
                data: {
                    otherUserId: group.person?._id,
                    productId: group.product?._id
                }
            });

            setMessages(prev =>
                prev.filter(msg => {
                    const sameProduct = String(msg.productId?._id) === String(group.product?._id);
                    const samePerson = String(msg.sender?._id) === String(group.person?._id) || 
                                       String(msg.receiver?._id) === String(group.person?._id);
                    return !(sameProduct && samePerson);
                })
            );
        } catch (err) {
            setStatusMessage("Unable to delete conversation.");
            console.error(err);
        }
    };

    return (
        <div className="messages-page">
            <div className="page-header-row">
                <h2 className="section-title">Inbox</h2>
                {statusMessage && <div className="page-message">{statusMessage}</div>}
            </div>

            {messages.length === 0 ? (
                <p className="empty-state">No messages found.</p>
            ) : (
                Object.values(groupedMessages).map((group) => (
                    <div className="message-card" key={group.key}>
                        <div className="message-card-header">
                            <div>
                                <p className="message-label">Conversation with</p>
                                <strong>{group.person?.name || "Unknown"}</strong>
                            </div>
                            <div>
                                <p className="message-label">Product</p>
                                <strong>{group.product?.title || "Untitled"}</strong>
                            </div>
                        </div>

                        <div className="message-thread">
                            {group.messages.map((msg) => (
                                <div key={msg._id} className={`message-row ${msg.sender?._id === currentUser ? "mine" : "theirs"}`}>
                                    <span className="message-sender">{msg.sender?.name || "User"}</span>
                                    <p>{msg.message}</p>
                                    <time>{formatDate(msg.createdAt || msg.timestamp)}</time>
                                </div>
                            ))}
                        </div>

                        <textarea
                            className="message-reply"
                            placeholder="Type your reply..."
                            value={replies[group.key] || ""}
                            onChange={(e) => handleReplyChange(group.key, e.target.value)}
                        />

                        <div className="message-actions">
                            <button className="cta-button" type="button" onClick={() => handleReply(group)}>
                                Reply
                            </button>
                            <button className="secondary-button" type="button" onClick={() => handleDelete(group)}>
                                Delete Conversation
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default Messages;