import Sidebar from "@/components/Sidebar";
import styles from '@/styles/Layout.module.css'
export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.wrapper}>
        <Sidebar role="ADMIN"/>
        <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
