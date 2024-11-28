import { zeroPad } from 'react-countdown';

export const renderer = ({ hours, minutes, seconds }) => (
    <span>
      {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
)
export const createDate = (time) => {
    const current = new Date()
    // current.setHours(current.getHours() + 3)
    current.setMinutes(current.getMinutes() + Number(time))
    return current.toUTCString()
}
export function getCookie(name) {
	var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}
export function setCookie(time){
    const date = new Date(time.text.time)
    document.cookie = `session=${time.text.encodeUserName}; expires=${date.toUTCString()}`
    document.cookie = `time=${date.toUTCString()}; expires=${date.toUTCString()}`
}
