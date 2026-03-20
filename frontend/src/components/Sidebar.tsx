"use client";

import styles from'@/styles/Sidebar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps{
    role:'ADMIN'|'RESIDENT';
}

export default function Sidebar({role}:SidebarProps){
    const pathname=usePathname();

    const menuConfig={
        ADMIN:[
            {name:'Dashboard',path:'/admin/dashboard'},
            {name:'Flats',path:'/admin/flats'},
            {name:'Subscriptions',path:'/admin/subscriptions'},
            {name:'Monthly Records',path:'/admin/monthly-records'},
            {name:'Payment Entry',path:'/admin/payment-entry'},
            {name:'Reports',path:'/admin/reports'},
            {name:'Notifications',path:'/admin/notifications'},
            {name:'Profile',path:'/admin/profile'}
        ],
        RESIDENT:[
            {name:'Dashboard',path:'/dashboard'},
            {name:'Subscriptions',path:'/subscriptions'},
            {name:'Profile',path:'/profile'}
        ]
    };

    const navItems=menuConfig[role];

    return(
        <aside className={`${styles.sidebar} ${role==='ADMIN'?styles.adminBg:styles.userBg}`}>
            <div className={styles.top}>
                <div className={styles.brand}>
                    {role==='ADMIN'?'Admin Portal':'Resident Portal'}
                </div>
                <nav className={styles.nav}>
                    {navItems.map((item)=>(
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.link} ${pathname===item.path?styles.active:""}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    )
}