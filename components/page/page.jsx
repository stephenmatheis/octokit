// @start-imports
import Link from "next/link";
import styles from './page.module.scss';
// @end-imports

// @start-export
export default function Header({ children }) {
    return (
        <div className={styles['page']}>
            {children}
        </div>
    )
};
// @end-export

// @start-component
<Header />
// @end-component