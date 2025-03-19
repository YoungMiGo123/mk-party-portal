
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/registration/RegisterForm";

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow pt-0 pb-16">
        <div className="bg-green-600 py-12 mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-heading font-bold tracking-tight text-white mb-2">
              Become a member of the <span className="text-yellow-400">MK Party</span>
            </h1>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <RegisterForm />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
