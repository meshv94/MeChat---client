import { useState, useEffect, useMemo } from 'react'
import { io } from 'socket.io-client'
import { toast } from 'react-toastify'

function App() {
  const socket = useMemo(() => new io('https://mechat-server-ht7t.onrender.com/'), [])

  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [userId, setUserId] = useState('')
  const [chat, setChat] = useState([])
  const [roomName, setRoomName] = useState('')
  // const [files, setFiles] = useState([]);
  // const [file, setFile] = useState();

  useEffect(() => {

    // this event run when socket is connected
    socket.on('connect', () => {
      // console.log(`welcome user you are now conncted with ${socket.id} `)
      setUserId(socket.id)
    })

    socket.on('user-join', (data) => {
      toast.success(data)
    })

    //
    socket.on('recieved-message', (data) => {
      // console.log(data)
      setChat((chat) => [...chat, data])
    })

    socket.on('joined-room', (data) => {
      toast.success(data)
    })

    // socket.on('file', (data) => {
    //   // console.log(data[0])
    //   setFiles(prevFiles => [...prevFiles, data[0]]);
    // });

    return () => {
      socket.disconnect();
    };

  }, [])

  const handleDisConnect = () => {
    // socket.disconnect()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', { message, room })
    setMessage("")
  }
  const handleJoinRoom = (e) => {
    e.preventDefault()
    socket.emit('room-name', roomName)
  }
  // const handleFileSubmit = async (e) => {
  //   e.preventDefault()
  //   try {
  //     const formData = new FormData();
  //     formData.append('fname', file);

  //     const result = await fetch("http://localhost:3000/files", {
  //       method: "POST",
  //       body: formData
  //     })
  //   } catch (error) {
  //     toast.error(error.message)
  //   }
  // }

  return (
    <>
      <div className="message">
        <h4>User Room ID : {userId}</h4>

        <form className="room-form" onSubmit={handleJoinRoom}>
          <input
            placeholder='Enter Room name to create or join room'
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button type='submit'>JOIN</button>
        </form>

        {/* <form className="file-form" onSubmit={handleFileSubmit}>
          <input
            type='file'
            onChange={(e) => setFile(e.target.files[0])}
          />
          <button type='submit'>Send File</button>
        </form> */}

        <div className="chat-message">
          <ul className="chat">
            {chat && chat.map((item, index) => {
              return <li key={index}>{item}</li>
            })}
          </ul>
        </div>

        <form className="message-form" onSubmit={handleSubmit}>
          <div>
          <input
            placeholder='Enter Room Name or User Room ID'
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          </div>
          <div>
            <textarea
            placeholder='Enter message'
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            />
            <button type='submit'>Send</button>
          </div>
        </form>
      </div>

    </>
  )
}

export default App;
