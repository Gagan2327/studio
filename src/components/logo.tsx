import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/">
      <h1 className="text-4xl font-extrabold tracking-tight text-primary font-headline cursor-pointer">
        GuidiGo
      </h1>
    </Link>
  );
}
