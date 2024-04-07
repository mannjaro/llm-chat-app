import ChatWindow from "../components/ChatWindow";
import { useAuth } from "../hooks/cognito";
function Chat() {
  const { isSignedIn } = useAuth();
  return (
    <>
      <h2>Chat</h2>
      {isSignedIn ? <ChatWindow /> : <p>Login to use Chat App</p>}
    </>
  );
}

export default Chat;
