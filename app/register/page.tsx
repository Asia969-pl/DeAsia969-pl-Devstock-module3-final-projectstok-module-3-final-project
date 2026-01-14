import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RegisterForm from "@/components/RegisterForm";

export default function Home() {
  return (
    <div className="min-h-screen ">
      <Header />
      <RegisterForm />
      <Footer />
    </div>
  );
}
