import RegisterForm from "@/components/RegisterForm";
import Welcome from "@/components/Welcome";

export default function RegisterPage() {
  return (
    <div className="grid grid-cols-2 min-h-screen">
      <Welcome />
      <RegisterForm />
    </div>
  );
}
