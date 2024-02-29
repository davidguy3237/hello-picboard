import Link from "next/link";

export default function TestPage() {
  return (
    <div>
      <div>Test Page</div>
      <Link href="/test/nested">Link to Nested Page</Link>
    </div>
  );
}
