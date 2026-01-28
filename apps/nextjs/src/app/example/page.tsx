import { ContactForm } from "./_components/contact-form";

export default function ExamplePage() {
  return (
    <main className="container h-screen py-16">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Contact <span className="text-primary">Example</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          A simple form with validation for E2E testing.
        </p>
        <ContactForm />
      </div>
    </main>
  );
}
