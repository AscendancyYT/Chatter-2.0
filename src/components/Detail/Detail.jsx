import { toast } from "react-toastify";
import { useChatStore } from "../../Library/chatStore"
import { auth, db } from "../../Library/firebase"
import { useUserStore } from "../../Library/userStore";
import "./detail.css"
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
  const {chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock} = useChatStore();
  const {currentUser} = useUserStore();

  const handleBlock = async () =>{
    if(!user) return;

    const userDocRef = doc(db, "users", currentUser.id)

    try{ 
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock()
    }catch(err){
      toast.error(err)
    }
  }
  return (
    <div className='detail'>
      <div className="user">
        <div className="img">{currentUser.username[0]}</div>
        <h2>{currentUser.username}</h2>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat settings</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{
          isCurrentUserBlocked ? "You are blocked" : isReceiverBlocked ? "User is blocked" : "Block user"  
        }</button>
        <button className="logout" onClick={()=>auth.signOut()}>Logout</button>
      </div>
    </div>
  )
}

export default Detail