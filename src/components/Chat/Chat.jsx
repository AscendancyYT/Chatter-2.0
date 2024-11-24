import { useEffect, useRef, useState } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../Library/firebase";
import { useChatStore } from "../../Library/chatStore";
import { toast } from "react-toastify";
import { useUserStore } from "../../Library/userStore";

const Chat = () => {
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState();

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });

    return () => {
      unSub();
    };
  }, [chatId]);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  const handleSend = async (e) =>{
    if(text === " ") return;

    try{
      await updateDoc(doc(db, "chats", chatId), {
        messages:arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date()
        })
      })

      const userIds = [currentUser.id, user.id]

      userIds.forEach(async (id)=>{
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapshot = await getDoc(userChatsRef);
  
        if(userChatsSnapshot.exists()){
          const userChatsData = userChatsSnapshot.data();
  
          const chatIndex = userChatsData.chats.findIndex((c)=>c.chatId === chatId);
  
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
  
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats
          })
        }
      })
      

    }catch(err){
      toast.error(err.message)
    }
  }

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <div className="img">{user.username[0]}</div>
          <div className="texts">
            <span>{user.username}</span>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div className={message.senderId === currentUser?.id ? "message own" : "message"} key={message?.createdAt}>
            <div className="texts">
              <p>{message.text}</p>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <input
          type="text"
          placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You can't send a message" : "Typa a message..."}
          onChange={(e) => setText(e.target.value)}
          value={text}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            value={text}
            onClick={() => setOpen((prev) => !prev)}
          />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
