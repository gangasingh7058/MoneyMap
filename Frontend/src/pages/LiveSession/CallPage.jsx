import { useEffect, useRef, useState } from "react";
import { Phone, RotateCcw, Video as VideoIcon, VideoOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import backgroundImage from '../../assets/image.png';

const VideoConferencePage = () => {
  const navigate = useNavigate();

  // --- State variables ---
  const [socket, setSocket] = useState(null);
  const [peer, setPeer] = useState(null);
  const [othersideId, setOthersideId] = useState(null);
  const [sdp, setsdp] = useState(null);
  const [conneciondone, setconnectiondone] = useState(false);

  const [isConnected, setIsConnected] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // --- Refs ---
  const localvideo = useRef();
  const remotevideo = useRef();

  // --- Setup WebSocket ---
  useEffect(() => {
    const setup_socket = () => {
      const ws = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_ROUTE}`);

      ws.onopen = () => console.log("Connected to WS server");
      ws.onclose = () => console.log("Disconnected from WS");
      ws.onerror = (err) => console.error("WebSocket error:", err);

      setSocket(ws);
    };

    setup_socket();

    return () => {
      socket?.close();
    };
  }, []);

  // --- Connect or re-connect user ---
  const connectUser = async () => {
    if (!socket || socket.readyState === WebSocket.CLOSED) return;

    const newPeer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    setTimeout(() => {
      socket.send(JSON.stringify({ type: "new-user" }));
    }, 1000);

    newPeer.onnegotiationneeded = async () => {
      const temp_sdp = await newPeer.createOffer();
      await newPeer.setLocalDescription(temp_sdp);
      setsdp(temp_sdp);
    };

    const iceCandidateQueue = [];

    newPeer.onicecandidate = (event) => {
      if (!event.candidate) return;

      if (othersideId != null) {
        socket.send(
          JSON.stringify({
            type: "ice-connection",
            iceconnections: event.candidate,
            otherside: othersideId,
          })
        );
      } else {
        iceCandidateQueue.push(event.candidate);
      }
    };

    const sendQueuedCandidates = () => {
      iceCandidateQueue.forEach((candidate) => {
        socket.send(
          JSON.stringify({
            type: "onice-connection",
            iceconnections: candidate,
            otherside: othersideId,
          })
        );
      });
      iceCandidateQueue.length = 0;
    };

    // Remote Video
    newPeer.ontrack = (event) => {
      setIsConnected(true);
      if (remotevideo.current) {
               
        remotevideo.current.srcObject = event.streams[0];

        setOthersideId(false);
        setTimeout(() => {
          setOthersideId(true);
        }, 5000);

      } else {
        alert("Error fetching remote video");
      }
    };

    // Local Video
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (localvideo.current) {
        localvideo.current.srcObject = stream;
      }
      stream.getTracks().forEach((track) => newPeer.addTrack(track, stream));
    } catch (err) {
      console.error("Error getting local media:", err);
    }

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.type === "send-offer") {
        setOthersideId(data.otherside);
        const offer = await newPeer.createOffer();
        await newPeer.setLocalDescription(offer);
        socket.send(
          JSON.stringify({ type: "offer", sdp: offer, otherside: data.otherside })
        );
      }

      if (data.type === "send-answer") {
        setOthersideId(data.otherside);
        setTimeout(sendQueuedCandidates, 10);
        await newPeer.setRemoteDescription(data.sdp);
        const answer = await newPeer.createAnswer();
        await newPeer.setLocalDescription(answer);
        socket.send(
          JSON.stringify({ type: "answer", sdp: answer, otherside: data.otherside })
        );
      }

      if (data.type === "other-side-answer") {
        setTimeout(sendQueuedCandidates, 10);
        await newPeer.setRemoteDescription(data.sdp);
      }

      if (data.type === "ice-connection") {
        try {
          await newPeer.addIceCandidate(new RTCIceCandidate(data.iceconnections));
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }

      if (data.type === "other-did-next" || data.type === "partner-disconnected") {
        resetRemoteVideo(true);
      }

    };

    setPeer(newPeer);
  };

  const connectnewcaller = () => {
    socket.send(JSON.stringify({ type: "next" }));
    resetRemoteVideo(false);
  };

  const resetRemoteVideo = (other_disconnected = false) => {
    if (remotevideo.current?.srcObject) {
      remotevideo.current.srcObject.getTracks().forEach((track) => track.stop());
      remotevideo.current.srcObject = null;
    }
    setIsConnected(false);
    setOthersideId(null);

    setTimeout(() => {
      if (!other_disconnected) {
        setTimeout(() => {
          connectUser();
        }, 3000);
      } else {
        connectUser();
      }
    }, 1);
  };

  const handleEndCall = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }
    console.log("ws connection closed");
    setSocket(null);

    if (remotevideo.current?.srcObject) {
      remotevideo.current.srcObject.getTracks().forEach((track) => track.stop());
      remotevideo.current.srcObject = null;
    }

    if (localvideo.current?.srcObject) {
      localvideo.current.srcObject.getTracks().forEach((track) => track.stop());
      localvideo.current.srcObject = null;
    }

    if (peer) {
      peer.getSenders().forEach((sender) => sender.track && sender.track.stop());
      peer.close();
      setPeer(null);
    }

    setIsConnected(false);
    setOthersideId(null);
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.pageHeader}>
        <div style={styles.navContainer}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}>🌱</div>
            <span style={styles.logoText}>FinanceFlow</span>
          </Link>
          <nav style={styles.navMenu}>
            <a href="#learn" style={styles.navLink}>Learn</a>
            <a href="#mentor" style={styles.navLink}>Mentor</a>
            <a href="#pricing" style={styles.navLink}>Pricing</a>
          </nav>
          <div style={styles.profileSection}>
            <div style={styles.profileAvatar}>👨‍💼</div>
          </div>
        </div>
      </header>

      <div style={styles.mainCard}>
        {/* Session Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {isConnected ? "✅ Connected" : "❌ Not Connected"}
          </h2>
          <div style={styles.headerControls}>
            <button
              onClick={handleEndCall}
              style={styles.endCallButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              <Phone style={{ width: '16px', height: '16px' }} /> End Call
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div style={styles.videoGrid}>
          {/* Local Video */}
          <div style={styles.videoContainer}>
            <video
              ref={localvideo}
              id="localVideo"
              autoPlay
              playsInline
              muted
              style={styles.video}
            />
            {!isVideoOn && (
              <div style={styles.videoOverlay}>
                <VideoOff style={{ width: '40px', height: '40px', marginBottom: '8px' }} />
                Camera Off
              </div>
            )}
          </div>

          {/* Remote Video */}
          <div style={styles.videoContainer}>
            <video
              ref={remotevideo}
              id="remoteVideo"
              autoPlay
              playsInline
              style={styles.video}
            />
            {!isConnected && (
              <div style={styles.videoOverlay}>
                <VideoOff style={{ 
                  width: '40px', 
                  height: '40px', 
                  marginBottom: '8px',
                  animation: 'pulse 2s infinite'
                }} />
                Waiting for connection...
              </div>
            )}
          </div>
        </div>

        {/* Connection Status */}
        <div style={styles.connectionStatus}>
          {othersideId == null ? "🔄 Waiting For Other Side" : "Connected"}
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          {!conneciondone && (
            <button
              onClick={() => {
                setconnectiondone(true);
                connectUser();
              }}
              style={styles.connectButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#047857'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#059669'}
            >
              Connect
            </button>
          )}

          {conneciondone && (
            <button
              disabled={!othersideId}
              onClick={connectnewcaller}
              style={{
                ...styles.nextButton,
                backgroundColor: othersideId ? '#f59e0b' : '#9ca3af',
                cursor: othersideId ? 'pointer' : 'not-allowed'
              }}
              onMouseOver={(e) => {
                if (othersideId) e.target.style.backgroundColor = '#d97706';
              }}
              onMouseOut={(e) => {
                if (othersideId) e.target.style.backgroundColor = '#f59e0b';
              }}
            >
              {othersideId == null ? "Connecting..." : othersideId == false ? "Wait For Next":"Next"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    minHeight: '100vh',
    background: `linear-gradient(135deg, rgba(243, 244, 246, 0.9) 0%, rgba(229, 231, 235, 0.9) 100%), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column'
  },
  pageHeader: {
    background: 'white',
    padding: '1rem 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#059669',
    textDecoration: 'none'
  },
  logoIcon: {
    fontSize: '1.8rem'
  },
  logoText: {
    color: '#059669'
  },
  navMenu: {
    display: 'flex',
    gap: '2rem'
  },
  navLink: {
    textDecoration: 'none',
    color: '#6b7280',
    fontWeight: '500',
    transition: 'color 0.3s ease'
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center'
  },
  profileAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem'
  },
  mainCard: {
    width: '100%',
    maxWidth: '1200px',
    margin: '2rem auto',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '2rem',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'white'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#1f2937'
  },
  headerControls: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  endCallButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#ef4444',
    color: 'white',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s ease',
    fontWeight: '600'
  },
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    padding: '2rem',
    backgroundColor: '#f9fafb'
  },
  videoContainer: {
    backgroundColor: '#1f2937',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    minHeight: '300px'
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  videoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(31, 41, 55, 0.8)',
    color: 'white'
  },
  connectionStatus: {
    textAlign: 'center',
    padding: '12px 0',
    color: '#374151',
    fontWeight: '500',
    backgroundColor: '#f9fafb',
    borderTop: '1px solid #e5e7eb'
  },
  controls: {
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb'
  },
  connectButton: {
    backgroundColor: '#059669',
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontWeight: '600',
    transition: 'background-color 0.3s ease'
  },
  nextButton: {
    color: 'white',
    padding: '0.75rem 2rem',
    borderRadius: '8px',
    border: 'none',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    fontWeight: '600',
    transition: 'background-color 0.3s ease'
  }
};

export default VideoConferencePage;
