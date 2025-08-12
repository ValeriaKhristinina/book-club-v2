import styles from "./layout.module.css";
import { Container, Group, Title, Text } from "@mantine/core";
import Link from "next/link";
import { UserAuth } from "~/context/auth-context";

interface LayoutProps {
  children: JSX.Element;
}

function Layout({ children }: LayoutProps) {
  const { isAuth, setIsAuth } = UserAuth();
  return (
    <Container className={styles.container}>
      <header className={styles.header}>
        <Group position="apart" w="100%">
          <Group>
            <Title size="20px">
              <Link href={"/"}>Book Club</Link>
            </Title>
          </Group>
          <Group>
            {isAuth ? (
              <p className={styles.navLink} onClick={() => setIsAuth(false)}>
                Logout
              </p>
            ) : (
              <Link className={styles.navLink} href={"/login"}>
                Login
              </Link>
            )}
          </Group>
        </Group>
      </header>
      {children}
      <footer className={styles.footer}>
        <Group position="right">
          <Group position="left">
            <Text>
              Created by{" "}
              <i>
                <Link href="https://github.com/ValeriaKhristinina">
                  Lera Khristinina
                </Link>
              </i>
            </Text>
          </Group>
        </Group>
      </footer>
    </Container>
  );
}

export default Layout;
