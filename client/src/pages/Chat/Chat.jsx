import { useEffect, useState, useRef } from "react";
import { useNavigate  } from "react-router-dom";
import Countdown from 'react-countdown';
import styles from './Chat.module.css';
import { socket } from '../CreateOrConnect/CreateOrConnect';
import { CloseButton } from "../../components/CloseButton/CloseButton";
import { renderer } from './../../utils';
import { getCookie } from "./../../utils";

const initialFields = {currentUser: '', online: 0, room: ''}

export const Chat = () => {
    const [messages, setMessages] = useState([])
    const [message, setMessage] = useState('')
    const input = useRef(null)
    const navigate = useNavigate()
    const timer = useRef()
    const [currentData, setCurrentData] = useState(initialFields)

    const handleSubmit = () => {
        socket.emit('sendMessage', {message: message, session: getCookie('session')})
        setMessage('')
        input.current.focus()
    };
    const loginOut = () => {
        socket.emit('loginOut', getCookie('session'))
    };
    useEffect(() => {
        const session = getCookie('session')
        if(session){
            socket.emit('connectRoom', session)
        }
        else{
            return navigate('/')
        }
    }, [])
    useEffect(() => {
        socket.on('initialMessage', ({message}) => {
            setCurrentData(prevs => ({...prevs, currentUser: message.text.currentUser, online: message.text.online.length, room: message.text.room}))
            document.title = `${message.text.currentUser} [${message.text.room}]`
            timer.current = <Countdown renderer={props => renderer(props)} date={getCookie('time')}></Countdown>
        })
    }, [])
    useEffect(() => {
        socket.on('chatMessage', ({message}) => {
            console.log('chatMessage', message)
            setMessages(prevs => [...prevs, message])
        })
    }, [])
    useEffect(() => {
        socket.on('updateOnlineRoom', ({message}) => {
            console.log('updateOnlineRoom', message)
            setCurrentData((prevs => ({...prevs, ['online']: message.text.online.length})))
        })
        socket.on('loginOutSuccess', () => {
            document.title = "let's chat"
            document.cookie = 'session=; max-age=-1;'
            document.cookie = 'time=; max-age=-1;'
            return navigate('/')
        })
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.chat}>
                <div className={styles.chat__header}>
                    <div className={styles.header__data}>Room №: {currentData.room} Online: {currentData.online} Time before closing: {timer.current}</div>
                    <CloseButton onClick={loginOut}/>
                </div>
                <div className={styles.chat__messages}>
                    {messages.map((message, index) =>
                    <div className={message.from === currentData.currentUser ? `${styles.message} ${styles.incoming}` : styles.message} key={index}>
                        <div className={styles.message__sender}>{message.from !== currentData.currentUser ? message.from : 'You'}</div>
                        <div className={message.from === currentData.currentUser ? `${styles.message__text} ${styles.incoming}` : styles.message__text}>{message.text}</div>
                    </div>)}
                </div>
                <div className={styles.chat__footer}>
                    <section className={styles.message__field}>
                        <input
                        ref={input}
                        value={message}
                        autoFocus={true}
                        autoComplete='off'
                        type='text'
                        name='username'
                        placeholder='type your message here...'
                        onChange={({target: {value}}) => setMessage(value)}
                        onKeyDown={({key}) => (message && key === 'Enter') && handleSubmit()}
                        />
                        <button
                        className={message && styles.active__button}
                        title='send a message'
                        type='button'
                        onClick={() => message && handleSubmit()}>Send</button>
                    </section>
                </div>
            </div>

        </div>
    )
}