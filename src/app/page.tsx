import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, Search, Share2, Sparkles } from 'lucide-react';

const features = [
  {
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    title: 'AI Superpowers',
    description: 'Summarize, rewrite, and generate ideas with Gemini. Your intelligent note-taking assistant.',
  },
  {
    icon: <Search className="h-8 w-8 text-primary" />,
    title: 'Hybrid Search',
    description: 'Find notes instantly with smart search that understands context, not just keywords.',
  },
  {
    icon: <Share2 className="h-8 w-8 text-primary" />,
    title: 'Auto-Tagging',
    description: 'Let AI organize your notes with automatic tagging and summarization on save.',
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Smart Notes</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/signup">Get Started</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="relative py-20 md:py-32">
          <div
            aria-hidden="true"
            className="absolute inset-0 top-0 -z-10 h-full w-full bg-background"
          >
            <div className="absolute bottom-auto left-auto right-0 top-0 h-[500px] w-[500px] -translate-x-[30%] translate-y-[20%] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(41,171,226,0.2),rgba(255,255,255,0))]"></div>
            <div className="absolute bottom-auto left-0 right-auto top-0 h-[500px] w-[500px] -translate-y-[10%] translate-x-[10%] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(48,213,200,0.2),rgba(255,255,255,0))]"></div>
          </div>

          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline">
                Capture Your Thoughts,
                <br />
                <span className="text-primary">Amplify Your Mind.</span>
              </h1>
              <p className="mt-6 text-lg text-foreground/80">
                Welcome to Smart Notes: Luc Edition. The intelligent, AI-powered
                note-taking app that helps you connect ideas and unleash your
                creativity.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Button size="lg" asChild className="bg-primary hover:bg-primary/90">
                  <Link href="/signup">Start for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-32 bg-primary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                A Smarter Way to Take Notes
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/70">
                Discover features designed to help you think better and work faster.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                  <CardHeader className="items-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-center text-foreground/70">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 md:px-6 text-center text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Smart Notes. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
