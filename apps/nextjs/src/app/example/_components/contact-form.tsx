"use client";

import { useContactForm } from "./contact-form.hook";
import { ContactFormView } from "./contact-form.view";

export function ContactForm() {
  const props = useContactForm();
  return <ContactFormView {...props} />;
}
