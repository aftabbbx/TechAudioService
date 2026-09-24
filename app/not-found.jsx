import { Button } from "@/components/ui/Button";

export const metadata = {
  title: "AudioTechServices | Page Not Found",
};

export default function NotFound() {
  return (
    <div
      className="min-h-[60vh] flex items-center justify-center"
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="text-center max-w-md px-6">
        <div
          className="text-8xl font-bold mb-4 opacity-10"
          style={{ color: "var(--primary)" }}
        >
          404
        </div>
        <h1
          className="text-2xl font-bold mb-3"
          style={{ color: "var(--text)" }}
        >
          Page Not Found
        </h1>
        <p
          className="text-sm mb-8 leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button href="/" size="lg">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
