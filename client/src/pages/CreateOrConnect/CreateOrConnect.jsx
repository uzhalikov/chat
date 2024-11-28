import { useEffect, useState } from "react";
import { useNavigate, useLocation  } from "react-router-dom";
import { io } from 'socket.io-client';
import { Logo } from "../../components/Logo/Logo";
import styles from './CreateOrConnect.module.css';
import { getCookie, setCookie } from "../../utils";

const HOST = '10.128.203.149'
const PORT = 8080

export const socket = io.connect(`http://${HOST}:${PORT}`)

const initFields = {
    name: '',
    time: '',
    code: '',
    error: ''
}

export const CreateOrConnect = () => {
    const navigate = useNavigate()
    const [values, setValues] = useState(initFields)
    const currentPathCreate = useLocation().pathname === '/create'
    const handleChange = ({target: {value, name}}) => {
        setValues(prevs => ({...prevs, [name]: value, error: initFields.error}))
    };
    const handleClick = (e) => {
        e.preventDefault()
        socket.emit(e.target.id, values)
    };

    useEffect(() => {
        getCookie('session') && navigate('/chat')
        socket.on('message', ({message}) => {
            if(message.text.error){
                setValues(prevs => ({...prevs, error: message.text.error}))
            }
            else{
                setCookie(message)
                return navigate(`/chat`)
            }
        })
        return () => console.log('Закрыто окно подключения')
    }, [navigate])
    return (
        <div className={styles.container}>
            <div className={styles.main}>
                <Logo/>
                <form className={styles.form} onSubmit={(e) => handleClick(e)}>
                    <input
                    autoFocus={true}
                    type="text"
                    name="name"
                    placeholder="your name"
                    required
                    onChange={handleChange}
                    autoComplete="off"/>
                    {currentPathCreate ? <input type="number" name="time" placeholder="life time" required onChange={handleChange} autoComplete="off"/> : <input type="text" name="room" placeholder="room" required onChange={handleChange} autoComplete="off"/>}
                    <input
                    type="password"
                    name="code"
                    placeholder="access code"
                    required
                    onChange={handleChange}
                    autoComplete="off"/>
                    <button
                    type="submit"
                    id={currentPathCreate ? 'createRoom' : 'checkRoom'}
                    className={currentPathCreate ? ((values.name && values.time && values.code) ? styles.ready : styles.unready ) : (values.name && values.code) ? styles.ready : styles.unready}
                    onClick={(e) => handleClick(e)}>
                    {currentPathCreate ? 'Create a room' : 'Connect to the room'}
                    </button>
                    <p className={styles.error}>{values.error}</p>
                </form>
            </div>

        </div>
    )
}