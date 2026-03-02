import Welcome from "@/components/Welcome";
import LoginForm from "../../forms/LoginForm";

export default function LoginPage() {
  return (
    <div className="grid grid-cols-2 min-h-screen">
      <Welcome />
      <LoginForm />
    </div>
  );
}
