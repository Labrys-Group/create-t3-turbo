"use client";

import { useCallback, useState } from "react";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";

const ContactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const useContactForm = () => {
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    validators: {
      onSubmit: ContactFormSchema,
    },
    onSubmit: () => {
      setSubmitted(true);
    },
  });

  const handleReset = useCallback(() => {
    form.reset();
    setSubmitted(false);
  }, [form]);

  return { form, submitted, handleReset };
};

export type UseContactFormReturn = ReturnType<typeof useContactForm>;
