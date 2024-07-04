import { FeedbackForm } from "./components/feedback-form";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback - Hello! Picboard",
};

export default function FeedbackPage() {
  return <FeedbackForm />;
}
