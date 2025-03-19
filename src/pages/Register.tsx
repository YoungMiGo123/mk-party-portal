
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/registration/RegisterForm";

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-grow pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              Member Registration
            </h1>
            <p className="text-mkneutral-500 max-w-2xl mx-auto">
              Complete the registration form below to create your account
            </p>
          </div>
          
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
