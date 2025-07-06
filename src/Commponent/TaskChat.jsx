import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Avatar, Typography, TextField, Button,
  Drawer, List, ListItem, ListItemAvatar, ListItemText, CircularProgress
} from '@mui/material';
import { FetchFromAPI } from '../Utility/connection';
import SimpleCache from '../Utility/SimpleCache';

export default function LocalChatApp({ taskID }) {
  const cache = new SimpleCache();
  const pageSize = 15;
  const ws = useRef(null);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [openMembers, setOpenMembers] = useState(false);
  const [taskMembers, setTaskMembers] = useState([]);
  const [pageNumberOfMembers, setPageNumberOfMembers] = useState(1);
  const [totalCountOfMembers, setTotalCountOfMembers] = useState(0);

  const [pageNumberOfMessages, setPageNumberOfMessages] = useState(1);
  const [totalCountOfMessages, setTotalCountOfMessages] = useState(0);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const messagesContainerRef = useRef(null);
  const previousScrollHeightRef = useRef(0);

  // ================= Members =================
  const [messagesJSX, setMessagesJSX] = useState([]);

  const fetchTaskMembersCount = async () => {
    const res = await FetchFromAPI(`TaskMember/GetCountTaskMembers?TaskID=${taskID}`);
    const data = await res.json();
    setTotalCountOfMembers(data);
  };
  const fetchTaskMembers = async (page) => {
    const res = await FetchFromAPI(`TaskMember/GetTaskMembersPaged?TaskID=${taskID}&PageNumber=${page}&PageSize=${pageSize}`);
    const data = await res.json();
    setTaskMembers(prev => [...prev, ...data]);
    cache.setListDataOfTaskChat(page, data);
  };

  const getTaskMembers = (page) => {
    if (cache.IsExistTaskChatMemberPage(page)) {
      const data = cache.getTaskChatMember(page);
      setTaskMembers(prev => [...prev, ...data]);
    } else {
      fetchTaskMembers(page);
    }
  };

  const handleScrollMembers = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      const totalPages = Math.ceil(totalCountOfMembers / pageSize);
      if (pageNumberOfMembers < totalPages) {
        const nextPage = pageNumberOfMembers + 1;
        setPageNumberOfMembers(nextPage);
        getTaskMembers(nextPage);
      }
    }
  };

  // ================= Messages =================

  const fetchMessagesCount = async () => {
    const res = await FetchFromAPI(`TaskChatMessage/GetCountTaskChatMessagesPaged?TaskID=${taskID}`);
    const count = await res.json();
    setTotalCountOfMessages(count);
  };

  const fetchMessagesPage = async (page) => {
    if (isLoadingMessages) return;
    setIsLoadingMessages(true);

    const res = await FetchFromAPI(`TaskChatMessage/GetTaskChatMessagesPaged?TaskID=${taskID}&PageNumber=${page}&PageSize=${pageSize}`);
    const data = await res.json();

    setIsLoadingMessages(false);
    setMessages(prev => [...prev, ...data]);
  };

  useEffect(() => {
    fetchMessagesCount();
    fetchMessagesPage(pageNumberOfMessages);
    fetchTaskMembersCount();
    getTaskMembers(pageNumberOfMembers);
  }, []);

  useEffect(() => {
    let retryCount = 0;
    let maxRetries = 5;
    let reconnectTimer = null;

    const onRetry = () => {
      retryCount = 0;
    };

    const connect = () => {
      if (retryCount >= maxRetries) {
        console.error("Max WebSocket retries reached.");
        return;
      }

      ws.current = setupWebSocket(taskID, setMessages, onRetry);

      ws.current.onclose = () => {
        retryCount++;
        const retryTime = 1000 * retryCount;
        console.warn(`WebSocket retry #${retryCount} in ${retryTime}ms...`);
        reconnectTimer = setTimeout(connect, retryTime);//call connect 
      };
    };

    connect();

    return () => {
      if (ws.current) {
        clearTimeout(reconnectTimer);
        // retryCount = maxRetries;
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [taskID]);

  useEffect(() => {
    const fetch = async () => {
      await buildMessagesJSX(messages, setMessagesJSX);
    };
    fetch();
  }, [messages]);



  // Scroll to bottom or keep scroll position

  const scrollBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 0);
  };
  const savePlaceOfMessageInScroll = () => {
    const container = messagesContainerRef.current;
    if (container && previousScrollHeightRef.current > 0) {
      const newScrollHeight = container.scrollHeight;
      const scrollDiff = newScrollHeight - previousScrollHeightRef.current;
      container.scrollTop = scrollDiff;
      previousScrollHeightRef.current = 0;
    }
  };


  const handleSend = () => {
    const text = newMessage.trim();
    if (!text || !ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    ws.current.send(text);
    setNewMessage('');
  };

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', height: '100%', maxHeight: '85vh', minHeight: '500px', p: 2,
      bgcolor: 'white', borderRadius: 3, boxShadow: 3, width: '100%',
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Chat</Typography>
        <Button variant="outlined" onClick={() => setOpenMembers(true)}>{totalCountOfMembers} Members</Button>
      </Box>

      <Box
        ref={messagesContainerRef}
        sx={{ flexGrow: 1, overflowY: 'auto', mb: 2, p: 1, bgcolor: '#fafafa', borderRadius: 2, border: '1px solid #ddd', position: 'relative' }}
      >
        {pageNumberOfMessages < Math.ceil(totalCountOfMessages / pageSize) && (
          <Box sx={{ textAlign: 'center', mb: 1 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={async () => {
                const nextPage = pageNumberOfMessages + 1;
                previousScrollHeightRef.current = messagesContainerRef.current?.scrollHeight || 0;
                setPageNumberOfMessages(nextPage);
                fetchMessagesPage(nextPage);
              }}
            >
              Load Older Messages
            </Button>
          </Box>
        )}

        {isLoadingMessages && (
          <Box sx={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
            <CircularProgress size={28} color="primary" />
          </Box>
        )}

        {messagesJSX}
        {pageNumberOfMessages === 1 ? scrollBottom() : savePlaceOfMessageInScroll()}
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Write a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          multiline
          minRows={1}
          maxRows={4}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <Button variant="contained" onClick={handleSend} sx={{ minWidth: '100px' }}>Send</Button>
      </Box>

      <Drawer anchor="right" open={openMembers} onClose={() => setOpenMembers(false)}>
        <Box sx={{ width: 250, p: 2, height: '100%', overflowY: 'auto' }} onScroll={handleScrollMembers}>
          <Typography variant="h6" mb={2}>Members</Typography>
          <List>
            {taskMembers.map((member) => (
              <ListItem key={member.taskMemberID}>
                <ListItemAvatar><Avatar src={member.imagePath} /></ListItemAvatar>
                <ListItemText primary={member.userName} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
async function buildMessagesJSX(messages, setMessagesJSX) {
  const cache = new SimpleCache();
  const fetchUser = async (id) => {
    const res = await FetchFromAPI(`User/GetSimpleUserData?UserID=${id}`);
    const data = await res.json();
    cache.setUser(id, data);
  };
  const getSender = async (id) => {
    let Data = cache.getUser(id);
    if (!Data) {
      await fetchUser(id);
      Data = cache.getUser(id);
    }
    return Data;
  };

  const jsxElements = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    const sender = await getSender(msg.userID);
    jsxElements.push(
      <Box key={msg.id || crypto.randomUUID()} sx={{ display: 'flex', alignItems: 'flex-start', mb: 2, maxWidth: '100%', gap: 1 }}>
        <Avatar src={sender?.imagePath || ''} sx={{ width: 32, height: 32 }} />
        <Box sx={{ bgcolor: '#f0f0f0', borderRadius: 2, px: 2, py: 1, maxWidth: '80%', whiteSpace: 'pre-wrap', wordBreak: 'break-word', boxShadow: 1 }}>
          <Typography variant="subtitle2" color="gray">{sender?.username || sender?.userName || 'Unknown'}</Typography>
          <Typography variant="body1" color="black">{msg.message}</Typography>
          <Typography variant="caption" color="gray">{new Date(msg.sentAt).toLocaleString()}</Typography>
        </Box>
      </Box>
    );
  }
  setMessagesJSX(jsxElements);
}

function setupWebSocket(taskID, setMessages, onRetry) {
  const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
  const url = `wss://manageit.tryasp.net/ws?taskId=${taskID}&access_token=${token}`;
  const socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("Connected to WebSocket server (task)");
    onRetry();
  };

  socket.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      const newMsg = {
        id: msg.id || crypto.randomUUID(),
        userID: msg.userId,
        userName: msg.userName,
        message: msg.message,
        sentAt: new Date().toLocaleString(),
      };
      setMessages(prev => [newMsg, ...prev]);
    } catch (e) {
      console.error("Invalid message received:", e.data);
    }
  };

  socket.onerror = (err) => console.error("WebSocket error:", err);
  socket.onclose = () => console.warn("WebSocket disconnected");

  return socket;
}
