import { useUserStore } from "../../../Library/userStore"
import "./userInfo.css"

const Userinfo = () => { 
  const {currentUser} = useUserStore();
  return (
    <div className='userInfo'>
      <div className="user">
        <div className="img">{currentUser.username[0]}</div>
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" />
        <img src="./edit.png" alt="" />
      </div>
    </div>
  )
}

export default Userinfo