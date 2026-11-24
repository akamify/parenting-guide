import LearningForm from "../components/LearningForm";

export const metadata = { title: "Register for the Free Parenting Workshop", description: "Register for the free Parenting Guide workshop. Every Sunday at 11 AM IST, live online.", alternates: { canonical: "/form/" }, openGraph: { url: "/form/" } };

export default function FormPage() {
  return <main id="main-content" tabIndex={-1}><LearningForm showStickyBar={false} /></main>;
}
