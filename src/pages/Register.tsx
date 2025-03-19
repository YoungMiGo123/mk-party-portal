
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/registration/RegisterForm";

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen bg-mkneutral-50">
      <Header />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-heading font-bold tracking-tight text-mkneutral-900 mb-4">
                Join MK Party
              </h1>
              <p className="text-mkneutral-600 max-w-2xl mx-auto">
                Complete the registration form below to become a member of the MK Party.
                Your information is protected and secure.
              </p>
            </div>
            
            <RegisterForm />
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
