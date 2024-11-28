import { Link, useNavigate } from "react-router-dom"
import { Logo } from "../../components/Logo/Logo"
import styles from './Start.module.css'
import { getCookie } from "../../utils"
import { useEffect } from "react"

export const Start = () => {
    const navigate = useNavigate()
    
    useEffect(() => {
        getCookie('session') && navigate('/chat')
    }, [])
    return (
        <div className={styles.container}>
            <Logo/>
            <div className={styles.links}>
                <Link className={styles.link} to="/create">Create</Link>
                <Link className={styles.link} to="/connect">Connect</Link>
            </div>
        </div>
    )
}