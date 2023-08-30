import "../../GlobalStyles/index.css";
import { useNavigate } from "react-router-dom";
import { useEffect,useRef} from "react";
import { useState } from "react";


const Viewer = () => {
  const navigate =useNavigate();
  const SocketRef = useRef();
  const [affirmation,setAffirmation] = useState("");

  useEffect(()=>{

    const socket = new WebSocket('ws://localhost:3002')
    socket.onopen = () => {
      console.log({ event: 'onopen' })
    }
  
    socket.onmessage = (message) => {
      const received = JSON.parse(message.data)
      const transcript = received.channel.alternatives[0].transcript || received.channel.transcript 
      if (transcript && received.is_final) {
        console.log(transcript)
        setAffirmation((prev)=>prev +" "+ transcript);
      }
    }
  
    socket.onclose = () => {
      console.log({ event: 'onclose' })
    }
    

    socket.onerror = (error) => {
      console.log({ event: 'onerror', error })
    }
  
    SocketRef.current = socket
  },[SocketRef.current])
  return (
    <div className="bg-black grid-cols-1 h-full">
      <div className="grid place-content-center"></div>
      <div className=" border-b-gray-200 border-b border-opacity-50 w-[80%] m-auto mt-9">
        <p className="text-white text-center mb-4">Live Streaming Room 1</p>
      </div>
      <div className="grid place-items-center">
        <div>
          <button className="bg-[#222] mt-2 p-4 text-white rounded-lg" onClick={()=>navigate("/signin")}>
            Start Stream
          </button>
        </div>
        <div className="grid place-content-center bg-[#101014] w-[45rem] h-[45rem] mt-16 rounded-xl mb-4">
          <textarea
            className="w-[40rem] outline-none text-white bg-black mt-14 border m-auto rounded-xl"
            name=""
            id=""
            value={affirmation}
            rows="25"
          ></textarea>
        </div>
      </div>
    </div>
  );
};
export default Viewer;