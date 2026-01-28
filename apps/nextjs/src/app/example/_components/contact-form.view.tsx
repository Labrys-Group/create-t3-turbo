"use client";

import { Button } from "@acme/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@acme/ui/field";
import { Input } from "@acme/ui/input";

import type { UseContactFormReturn } from "./contact-form.hook";

export function ContactFormView({
  form,
  submitted,
  handleReset,
}: UseContactFormReturn) {
  if (submitted) {
    return (
      <div className="flex w-full max-w-2xl flex-col items-center gap-4 rounded-lg border p-8">
        <h2 className="text-primary text-2xl font-bold">
          Thanks for your message!
        </h2>
        <p className="text-muted-foreground">We'll get back to you soon.</p>
        <Button onClick={handleReset}>Send another</Button>
      </div>
    );
  }

  return (
    <form
      className="flex w-full max-w-2xl flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Your name"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="email"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="you@example.com"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <form.Field
        name="message"
        children={(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldContent>
                <FieldLabel htmlFor={field.name}>Message</FieldLabel>
              </FieldContent>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                aria-invalid={isInvalid}
                placeholder="Your message (at least 10 characters)"
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
