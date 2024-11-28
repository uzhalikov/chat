import logo from './../../images/logo.png';
import styles from './Logo.module.css';
import { Link } from "react-router-dom"

export const Logo = () => {
    return (
        <div>
            <img width='120px' src={logo} alt="Main logo"/>
            <Link to={'/'} className={styles.logo__text}>let's chat!</Link>
        </div>
    )
}