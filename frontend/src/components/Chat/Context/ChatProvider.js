// import { createContext, useContext, useState, useEffect } from 'react';
// import { useNavigate } from "react-router-dom";

// const ChatContext = createContext();

// const ChatProvider = ({ children }) => {
//     const [user, setUser] = useState();

//     useEffect(() => {
//         const userInfoString = localStorage.getItem("userInfo");
//         const userInfo = JSON.parse(userInfoString);
//         setUser(userInfo);

//         // if (!userInfo) {
//         //     navigate("/login");
//         // }
//     }, []);

//     return (
//         <ChatContext.Provider user={user} setUser={setUser}>
//             {children}
//         </ChatContext.Provider>
//     )
// }

// export const ChatState = () => {
//     return useContext(ChatContext);
// }

// export default ChatProvider;