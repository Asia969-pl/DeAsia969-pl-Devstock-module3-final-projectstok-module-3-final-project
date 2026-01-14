import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoginForm from "@/components/LoginForm";


export default function Home() {
  return (
    <div className="min-h-screen ">
      <Header />
      <LoginForm/>
      <Footer />
    </div>
  );
}
