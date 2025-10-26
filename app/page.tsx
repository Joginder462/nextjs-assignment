import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Project Management Tool</h1>
      <p>
        <Link href="/login">Login</Link> | <Link href="/register">Register</Link> | <Link href="/dashboard">Dashboard</Link>
      </p>
    </main>
  );
}
