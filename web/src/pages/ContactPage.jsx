import { useState } from "react";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { dismissToast, showSuccess, showError } from "../utils/toast";
import { sendContactEmail } from "../api/contactUs.api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactUsSchema } from "../schemas/contactUsForm.validation";

const ContactPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactUsSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await sendContactEmail(data);
      dismissToast();
      showSuccess(
        response.message ||
          "Your message has been sent. We'll get back to you soon.",
      );
      reset();
    } catch (err) {
      dismissToast();
      const response = err.response?.data;
      showError(
        response?.message ||
          "Failed to send your message. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-background">
      <div className="container mx-auto px-4 py-12 lg:py-20 max-w-7xl">
        {/* Header Section */}
        <div className="max-w-2xl mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
            Have questions about our products or need assistance? Our team is
            here to help you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 bg-primary rounded-3xl text-white shadow-xl shadow-primary/20">
              <h3 className="text-2xl font-semibold mb-6">
                Contact Information
              </h3>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
                    <FiPhone size={24} />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Call us directly</p>
                    <p className="font-medium text-lg">+977 11112222</p>
                    <p className="text-sm text-white/60">
                      Mon-Fri from 9am to 6pm
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
                    <FiMail size={24} />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Email support</p>
                    <p className="font-medium text-lg text-break">
                      example@shopmandu.com
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md shrink-0">
                    <FiMapPin size={24} />
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Our Location</p>
                    <p className="font-medium text-lg">Kathmandu, Nepal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-8  bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-15">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                variant="outline"
                className="h-12 bg-gray-50/50 dark:bg-accent/50"
                error={errors.name?.message}
                {...register("name")}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="example@gmail.com"
                variant="outline"
                className="h-12 bg-gray-50/50 dark:bg-accent/50"
                error={errors.email?.message}
                {...register("email")}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+977 98XXXXXXXX"
                variant="outline"
                className="h-12 bg-gray-50/50 dark:bg-accent/50"
                error={errors.phone?.message}
                {...register("phone")}
              />

              <Input
                label="Message"
                placeholder="Tell us how we can help..."
                variant="outline"
                multiline={true}
                rows={6}
                className="bg-gray-50/50 dark:bg-accent/50"
                error={errors.message?.message}
                {...register("message")}
              />

              <div className="pt-3">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full md:w-auto min-w-45"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending Message..." : "Send Message"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
