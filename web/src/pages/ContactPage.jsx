import { useState } from "react";
import { FiPhone, FiMail } from "react-icons/fi";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { dismissToast, showSuccess, showError } from "../utils/toast";
// import { submitContactForm } from "../api/contactApi";

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setIsSubmitting(true);

    try {
      await submitContactForm(formData);
      dismissToast();
      showSuccess("Your message has been sent. We'll get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      dismissToast();
      if (err.fieldErrors) setFieldErrors(err.fieldErrors);
      showError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-light text-primary">
            <FiPhone size={16} />
          </span>
          <span className="text-sm text-muted-foreground">Contact Us</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
          {/* Contact details */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-white flex-shrink-0">
                <FiPhone size={18} />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">Call To Us</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We are available 24/7, 7 days a week.
                </p>
                <p className="mt-1 text-sm text-foreground">Phone: +977 11112222</p>
              </div>
            </div>

            <div className="my-6 border-t border-border" />

            <div className="flex items-start gap-4">
              <span className="flex items-center justify-center w-11 h-11 rounded-full bg-primary text-white flex-shrink-0">
                <FiMail size={18} />
              </span>
              <div>
                <h3 className="font-semibold text-foreground">Write To Us</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Fill out our form and we will contact you within 24 hours.
                </p>
                <p className="mt-1 text-sm text-foreground">Email: customer@shopmandu.com</p>
                <p className="text-sm text-foreground">Email: support@shopmandu.com</p>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Input
                    name="name"
                    placeholder="Your Name"
                    variant="ghost"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {fieldErrors.name && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.name}</p>
                  )}
                </div>
                <div>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Your Email"
                    variant="ghost"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {fieldErrors.email && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
                  )}
                </div>
                <div>
                  <Input
                    name="phone"
                    type="tel"
                    placeholder="Your Phone"
                    variant="ghost"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                  {fieldErrors.phone && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
                  )}
                </div>
              </div>

              <div>
                <Input
                  name="message"
                  placeholder="Your Message"
                  variant="ghost"
                  multiline
                  rows={7}
                  required
                  value={formData.message}
                  onChange={handleChange}
                />
                {fieldErrors.message && (
                  <p className="mt-1 text-xs text-red-500">{fieldErrors.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="px-8 cursor-pointer" disabled={isSubmitting}>
                  {isSubmitting ? "Sending..." : "Send Message"}
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