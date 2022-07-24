import { LoginState } from "../../../store/slices/loginSlice";
import axiosInstance from "../../../api/axios";

export const isObjectEmpty = (obj: any) => {
  return Object.keys(obj).length === 0;
}


export const getMyCustomDateTime = (isoDateFromDB: Date): string => {

  const myDateOptions: object = {
      weekday: "long", day: "2-digit", month: "long", year: "numeric", hour12: true,
  };
  const myTimeOptions: object = { timeStyle: "short" };

  const myFavoriteDate = new Date(isoDateFromDB).toLocaleString("en-us", myDateOptions);
  const myFavoriteTime = new Date(isoDateFromDB).toLocaleString("en-us", myTimeOptions);

  // return [myFavoriteDate, myFavoriteTime];
  return `${myFavoriteDate} at ${myFavoriteTime}`;
}

export const getMyCustomTime = (isoDateFromDB: Date): string => {
  const myTimeOptions: object = { timeStyle: "short" };
  const myFavoriteTime = new Date(isoDateFromDB).toLocaleString("en-us", myTimeOptions);
  // return [myFavoriteDate, myFavoriteTime];
  return myFavoriteTime;
}


export const getShortDateTime = (isoDateFromDB: Date): string => {

  const myDateOptions: object = {
      weekday: "short", day: "2-digit", month: "short", year: "numeric", hour12: true,
  };
  const myTimeOptions: object = { timeStyle: "short" };

  const myFavoriteDate = new Date(isoDateFromDB).toLocaleString("en-us", myDateOptions);
  const myFavoriteTime = new Date(isoDateFromDB).toLocaleString("en-us", myTimeOptions);

  // return [myFavoriteDate, myFavoriteTime];
  return `${myFavoriteDate} at ${myFavoriteTime}`;
}

export const updateLastSeenMessageId = async (channelId: any, memberId: any) => {
  await axiosInstance().patch(`message/setIsSeen`, {
    channelId, memberId
  });
}

export const isSameSender = (messages: any[], m: any, i: number, myId: any) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].senderId !== m.senderId ||
      messages[i + 1].senderId === undefined) &&
    messages[i].senderId !== myId
  );
};

export const isLastMessage = (messages: any[], i: number, myId: any) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].senderId !== myId &&
    messages[messages.length - 1].senderId
  );
};


export const isSameSenderMargin = (messages: any[], m: any, i: number, myId: any) => {
  // console.log(i === messages.length - 1);  
  if (
    i < messages.length - 1 &&
    messages[i + 1].senderId === m.senderId &&
    messages[i].senderId !== myId
  )
    return 37; //the sender is not me, and it's not his last message
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].senderId !== m.senderId &&
      messages[i].senderId !== myId) ||
    (i === messages.length - 1 && messages[i].senderId !== myId)
  )
    return 0; //the sender is not me; but this time it's his last message. We will show his avatar, so no need to make margin left.
  else return "auto"; // then I am the sender.
};

export const isSameUser = (messages: any[], m: any, i: number) => {
  return i > 0 && messages[i - 1].senderId === m.senderId;
};


export const getSender = (chat: any, authState: LoginState) => {
  // We only invoke this function for the non-group chats.
  // Hence, we are sure that the members array will contain only 2 members: me and the other person.
  // Ex: Faris sends to Mohammad. 
  // From Faris's account, the channel name will be: "Mohammad"
  // and from Mohammad's account, the channel name will be: "Faris".
  const sender = chat?.members?.find(
    (member: any) => member.memberId != authState.user.employeeId
  );
  return sender?.fullName;
}

// export const getSender = (loggedUser, users) => {
//   return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
// };

// export const getSenderFull = (loggedUser, users) => {
//   return users[0]._id === loggedUser._id ? users[1] : users[0];
// };