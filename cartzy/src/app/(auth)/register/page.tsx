import Welcome from "@/components/Welcome";
import RegisterForm from "../../forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="grid grid-cols-2 min-h-screen">
      <Welcome />
      <RegisterForm />
    </div>
  );
}
