import { useState } from "react"
import "./login.css"
import { toast } from "react-toastify";
import {createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth"
import { auth, db } from "../../Library/firebase";
import { doc, setDoc } from "firebase/firestore";

const Login = () => {
  
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true)

    const formData = new FormData(e.target);
    const{email, password} = Object.fromEntries(formData);

    try{
      await signInWithEmailAndPassword(auth, email, password)
    }catch(err){
      console.log(err);
      toast.error(err.message);
    }finally{
      setLoading(false);
    }
  }

  const handleRegister = async (e) => {
    setLoading(true)

    e.preventDefault();
    const formData = new FormData(e.target);

    const{username, email, password} = Object.fromEntries(formData)

    try{
      const res = await createUserWithEmailAndPassword(auth, email, password)
      
      await setDoc(doc(db, "users", res.user.uid), {
        id: res.user.uid,
        username,
        email,
        blocked: []
      });

      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });

      toast.success("Account created")
    }catch(err){
      console.log(err);
      toast.error(err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className='login'>
      <div className="item">
        <h2>Welcome back, </h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email"/>
          <input type="password" placeholder="Password" name="password"/>
          <button disabled={loading}>{loading ? "Fetching data" : "Sign In"}</button>
        </form>
      </div>
      <div className="seperator"></div>
      <div className="item">
      <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Username" name="username"/>
          <input type="text" placeholder="Email" name="email"/>
          <input type="password" placeholder="Password" name="password"/>
          <button disabled={loading}>{loading ? "Pushing data" : "Sign Up"}</button>
        </form>
      </div>
    </div>
  )
}

export default Login