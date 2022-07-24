import axiosInstance from "../../../api/axios";

// -------------- Javascript File Download --------------
// Javascript function to trigger browser to save data to file as if it was downloaded.
import fileDownload from "js-file-download";


// This function gives each file a proper icon image according to its mimeType when I am uploading files to the react-dropzone area:
export const getProperThumbnail = (file: any) => {
    console.log(file.fileInfo);
    const mimeType = file.fileInfo.type;
    const [type, subtype] = mimeType.split('/'); // ex: type: "application", subtype: "pdf"

    const imageTypes = ['png', 'jpg', 'jpeg', 'gif'];
    const videoTypes = ['mp4', 'webm', 'ogg', 'mpeg', 'mp2t', '3gpp', '3gpp2'];
    const docTypes = ['msword', 'doc', 'docx', 'rtf', 'vnd.openxmlformats-officedocument.wordprocessingml.document'];


    if (imageTypes.includes(subtype)) {
        // then the file is an image, so return its dataURL to be shown on the browser
        return file.dataURL;
    }
    else if (docTypes.includes(subtype)) {
        return "https://i.imgur.com/3o1fJ7R.png";
        // return "../../../../public/images/docImage.png";
    }
    else if (['pdf'].includes(subtype)) {
        return "https://i.imgur.com/oRMlYfk.png";
        // return "../../../../public/images/pdf.png";
    }
    else if (videoTypes.includes(subtype)) {
        return "https://i.imgur.com/U4AzWU3.png";
        // return "../../../../public/images/video.png"
    }
    else if (type === "text") {
        // for ex: text/json, text/csv, text/css, text/javascript, text/html, ...
        return "https://i.imgur.com/BtWCADl.png";
        // return "../../../../public/images/textSlash.png"
    }
    return "https://i.imgur.com/mB2nYfw.png";
}


export const handleDownload = (e: any, attachment: any) => {
    const fileOriginalName = attachment.description;
    e.preventDefault();
    axiosInstance().get(`/downloadFile?fileName=${attachment.fileName}`, {
        responseType: "blob",
    }).then((response: any) => {
        console.log(response.data);
        // The server-side returns the requested file via a `res.download`, now the file is returned in `blob` format, which can be passed to the function `fileDownload` from library "js-file-download" and it will trigger the browser to download the file with the name provided in the 2nd argument:
        fileDownload(response.data, fileOriginalName);
    }).catch((error: any) => console.log(error?.message));
}
// ------------------------------------------
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
// ------------------------------------------
export const getMyCustomDate = (isoDateFromDB: Date): string => {

    const myDateOptions: object = {
        weekday: "long", day: "2-digit", month: "long", year: "numeric", hour12: true,
    };
    const myFavoriteDate = new Date(isoDateFromDB).toLocaleString("en-us", myDateOptions);
    // return [myFavoriteDate, myFavoriteTime];
    return myFavoriteDate;
}
// ------------------------------------------
export const getMyCustomTime = (isoDateFromDB: Date): string => {
    const myTimeOptions: object = { timeStyle: "short" };
    const myFavoriteTime = new Date(isoDateFromDB).toLocaleString("en-us", myTimeOptions);
    // return [myFavoriteDate, myFavoriteTime];
    return myFavoriteTime;
}

export const stringToColor = (string: string) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}


