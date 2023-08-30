import { useState, useRef } from "react";
import microphone from "./assets/MICROPHONE.jpg";
import microphonegif from "./assets/MICROPHONE.gif";
import { useEffect } from "react";
import Swal from "sweetalert2";
import Select, { components } from "react-select";
import "./style/index.css";
import micicon from "./assets/Microphone.jpg";
import axios from "axios";
import useWebSocket, { ReadyState } from "react-use-websocket";

const Streamer = () => {
  const [micsList, setMicsList] = useState([]);
  const [imageSrc, setImageSrc] = useState(false);
  const [selectedMic, setSelectedMic] = useState("No Mic Available");
  const [stream, setStream] = useState();
  const [transcription, setTranscription] = useState("");
  const [socket, setSocket] = useState();
  const [mediaRecorder, setMediaRecorder] = useState();
  const socketRef = useRef(null);
  const mediaRecRef = useRef(null);
  const [affirmation, setAffirmation] = useState("");


  useEffect(() => {
    
    // fetch
    //   .post(`http://localhost:5000/api/updatedata/${data1}`)
    //   .then((data) => {
    //     // Swal.fire("Request successfu;ll",e.message,"error");
    //     console.log("I am saved data post request");
    //     console.log(data);
    //   })
    //   .catch((e) => {
    //     console.log("I am saved data error post request");
    //     // Swal.fire("Error Occured",e.message,"error");
    //     console.log(e);
    //   });
  }, []);
  // const [messageHistory, setMessageHistory] = useState([]);

  // const { sendMessage, lastMessage, readyState } = useWebSocket(
  //   "ws://localhost:3002"

  // );

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Open",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  // }[readyState];

  // useEffect(() => {
  //   if (lastMessage !== null) {
  //     setMessageHistory((prev) => prev.concat(lastMessage));
  //   }
  // }, [lastMessage, setMessageHistory]);

  const handleChange = (value) => {
    console.log("I am the value");
    console.log(value);
    navigator.mediaDevices
      .getUserMedia({
        audio: {
          deviceId: value?.id ? { exact: value?.id } : undefined,
        },
      })
      .then((s) => {
        console.log("I am mic selected Stream");
        console.log(s);
        setStream(s);

        setSelectedMic(value);
        Swal.fire(
          "Mic Access Successfully",
          `${value?.value} Mic accessed successfully you can start the mic now`,
          "success"
        );
      })
      .catch((error) => {
        Swal.fire(
          "Error Occured",
          `Error occured While accessing mic Errir: ${error} `,
          "error"
        );
      });
  };
  useEffect(() => {
    if (stream) {
      console.log(
        "-------------------------------------I am media rec-------------------------"
      );

      mediaRecRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
    }
  }, [stream]);
  const Option = (props) => (
    <components.Option {...props} className="country-option flex">
      <img src={micicon} alt="logo" className="country-logo" />
      {console.log("I am inside option")}
      {console.log(props)}
      <p className="text-white flex">{props.data?.value}</p>
    </components.Option>
  );

  const SingleValue = ({ children, ...props }) => (
    <components.SingleValue {...props}>
      <img src={micicon} alt="s-logo" className="selected-logo" />
      {console.log("I am inside option")}
      {console.log(props)}
      <p className="text-white flex">{props.data?.value}</p>
    </components.SingleValue>
  );

  const handleChangeText = (e) => {
    setAffirmation((prev) => prev + ` ${e.target.value}`);
  };

  const startBroadcast = async () => {
    if (!stream) {
      Swal.fire("Mic Issue", "Please Access the mic first", "error");
      return;
    }

    if (!MediaRecorder.isTypeSupported("audio/webm")) {
      Swal.fire(
        "Browser Isssue",
        "You browser not supported this format",
        "error"
      );
      return;
    }

    console.log("I am the stream");
    console.log(stream);

    await Promise.resolve()
      .then(async () => {})
      .then(() => {
        const socket = new WebSocket("ws://localhost:3002");
        socket.onopen = () => {
          console.log({ event: "onopen" });
          mediaRecRef.current.addEventListener(
            "dataavailable",
            async (event) => {
              if (event.data.size > 0 && socket.readyState === 1) {
                socket.send(event.data);
              }
            }
          );
          mediaRecRef.current.start(1000);
        };

        socket.onmessage = (message) => {
          const received = JSON.parse(message.data);
          console.log("I am received");
          console.log(received);
          const transcript =
            received.channel.alternatives[0].transcript ||
            received.channel.transcript;
          if (transcript && received.is_final) {
            console.log(transcript);
            setAffirmation((prev) => prev + transcript);
          }
        };

        socket.onclose = () => {
          console.log({ event: "onclose" });
        };

        socket.onerror = (error) => {
          console.log({ event: "onerror", error });
        };

        socketRef.current = socket;
      })
      .catch((error) => {
        Swal.fire("Error Occured", `${error}`, "error");
      });
  };

  useEffect(() => {
    console.log("I am transctiption");
    console.log(transcription);
  }, [transcription]);

  const endBroadcast = async () => {
    if (mediaRecRef.current) {
      await mediaRecRef.current.stop();
    }

    if (socketRef.current) {
      await socketRef.current.close();
    }
  };

  const fechpost = ()=>{

    const data1 = "Thisisthetestdata"
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'React POST Request Example' })
  };
  fetch('http://localhost:5000/api/updatedata', requestOptions)
      .then(response => console.log(response.json())).catch((e)=>{
        console.log({"error":e.message});
      })
  }



  useEffect(() => {
    // Get a list of available microphones and populate the dropdown
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const micsArr = [];
      devices.forEach((device) => {
        if (device.kind === "audioinput") {
          const singleMic = {
            icon: micicon,
            value: device.label || `Microphone ${device.deviceId + 1}`,
            id: device.deviceId,
          };
          micsArr.push(singleMic);
        }
      });
      setMicsList([...micsArr]);
    });
  }, []);
  return (
    <div className="h-full grid-cols-1 bg-black">
      <div className="grid place-content-center"></div>
      <div className="m-auto mt-9 w-[80%] border-b border-b-gray-200 border-opacity-50">
        <p className="mb-4 text-center text-white">Live Streaming Room 1</p>
        <button onClick={fechpost} className="text-white">ClickHere</button>
      </div>
      <div className="grid place-content-center">
        <div className="mb-6 mt-16 grid h-[27rem] w-[45rem] place-items-center rounded-xl bg-[#101014]">
          <p className="mt-8 text-center text-xl font-bold font-sans text-white">
            Room 1 Start Broadcasting
          </p>
          <p className="mb-4 w-80 text-center text-white font-sans">
            Click the mic to transcribe live. ( Once room have started you must
            have stop streaming from this page to enable another instance to
            start streaming to room1 )
          </p>
          <div className="grid place-content-center">
            <img
              className="w-[150px] h-[150px]"
              onClick={async (e) => {
                e.preventDefault();

                if (imageSrc) {
                  await endBroadcast();

                  setImageSrc(!imageSrc);
                } else if (!imageSrc) {
                  await startBroadcast();
                  if (socketRef.current) {
                    setImageSrc(!imageSrc);
                  }
                }
              }}
              src={imageSrc ? microphonegif : microphone}
              alt=""
            />
          </div>

          <div className="controls  grid place-content-center mb-4">
            <Select
              className="w-[27rem]"
              value={selectedMic}
              options={micsList}
              onChange={handleChange}
              styles={{
                singleValue: (base) => ({
                  ...base,
                  display: "flex",
                  color: "#FFFFFF",
                  background: "#152534",
                  alignItems: "center",
                }),
                control: (base, state) => ({
                  ...base,
                  background: "#152534",
                  // match with the menu
                  color: "#FFFFFF",
                  borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
                  // Overwrittes the different states of border
                  borderColor: state.isFocused ? "yellow" : "blue",
                  // Removes weird border around container
                  boxShadow: state.isFocused ? null : null,
                  "&:hover": {
                    // Overwrittes the different states of border
                    borderColor: state.isFocused ? "red" : "blue",
                  },
                }),
                menu: (base) => ({
                  ...base,
                  background: "#000000",

                  // override border radius to match the box
                  borderRadius: 0,
                  // kill the gap
                  marginTop: 0,
                }),
                menuList: (base, state) => ({
                  ...base,
                  background: "#000000",
                  // kill the white space on first and last option
                  padding: 0,
                }),
              }}
              components={{
                Option,
                SingleValue,
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid place-content-center">
        <div className="grid place-items-center bg-[#101014] w-[45rem] h-[20rem] mt-16 rounded-xl mb-4">
          <p className="text-white text-xl font-bold font-sans">
            Live Transcription
          </p>
          <textarea
            className="w-[40rem] outline-none text-white bg-black mt-4 border m-auto rounded-xl overflow-auto"
            name=""
            id=""
            value={affirmation}
            rows="10"
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default Streamer;
