import Link from "next/link";
import { Button } from "../ui/button";

function HeroSection() {
  return (
    <section className="brutal-border border-x-0 border-t-0 bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-6xl lg:text-8xl font-heading font-bold leading-none tracking-tight">
              GET HIRED.
              <br />
              <span className="text-accent">FASTER.</span>
            </h1>
            <p className="font-mono text-lg mt-8 text-muted-foreground max-w-lg leading-relaxed">
              AI-POWERED JOB MATCHING THAT CUTS THROUGH THE NOISE. NO FLUFF. NO
              GHOST JOBS. JUST REAL OPPORTUNITIES MATCHED TO YOUR SKILLS.
            </p>
            <div className="flex gap-0 mt-10">
              <Link href="/jobs">
                <Button variant="accent">BROWSE JOBS →</Button>
              </Link>
            </div>
          </div>
          <div className="brutal-border border-accent p-8 bg-background text-foreground">
            <p className="font-mono text-xs text-muted-foreground mb-4">
              SYSTEM STATUS
            </p>
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between border-b-3 border-muted pb-2">
                <span>ACTIVE JOBS</span>
                <span className="font-bold text-accent">13</span>
              </div>
              <div className="flex justify-between border-b-3 border-muted pb-2">
                <span>APPLICATIONS TODAY</span>
                <span className="font-bold text-accent">127</span>
              </div>
              <div className="flex justify-between border-b-3 border-muted pb-2">
                <span>AVG MATCH SCORE</span>
                <span className="font-bold text-accent">7.8</span>
              </div>
              <div className="flex justify-between">
                <span>AI ENGINE</span>
                <span className="font-bold text-accent">● ONLINE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { HeroSection };