import Sidebar from "@/components/Sidebar";
import styles from "@/styles/Layout.module.css";
import UserProvider from "./UserProvider";
export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <div className={styles.wrapper}>
        <Sidebar role="RESIDENT" />
        <main className={styles.mainContent}>{children}</main>
      </div>
    </UserProvider>
  );
}
