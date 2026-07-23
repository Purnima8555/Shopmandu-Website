


import { FaUsers, FaBullseye, FaCheckCircle,  FaTicketAlt, FaHeart, FaClock, FaShoppingBag } from 'react-icons/fa';

import img1 from '../assets/images/img1.png';
import img2 from '../assets/images/img2.png';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.png';

const images = {
  img1,
  img2,
  img3,
  img4,
};

const AboutPage = () => {
  return (
    <div className="font-sans text-gray-800 min-h-screen">
      
      {/* Minimalist Dark Banner */}
      <div className="relative mt-1 overflow-hidden bg-linear-to-t from-slate-800 via-slate-700 to-slate-600 pt-10 pb-48">
        {/* Geometric Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full"
               style={{
                 backgroundImage: `radial-gradient(circle at 25% 25%, white 2px, transparent 2px),
                                  radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
                 backgroundSize: '60px 60px'
               }}>
          </div>
        </div>
        
        {/* Floating Particles */}
        {/* <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div> */}

        {/* Main Content with Split Layout */}
        <div className="relative z-10 px-6 md:px-16 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Side - Content */}
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-0.5 w-12 bg-primary"></div>
                  <span className="text-sm font-medium uppercase tracking-wide text-primary">
                    About Shopmandu
                  </span>
                </div>

                <h1 className="text-5xl font-black leading-tight text-white md:text-6xl">
                  Redefining
                  <span className="block text-primary">
                    Online Shopping
                  </span>
                  <span className="block font-light text-white/80">
                    For Everyone
                  </span>
                </h1>
              </div>

              <p className="max-w-lg text-lg leading-relaxed text-gray-300">
                Shopmandu is your trusted online marketplace where quality products,
                reliable sellers, and seamless shopping come together.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  <FaTicketAlt className="text-primary" />
                  Secure Checkout
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  <FaClock className="text-primary" />
                  Fast Delivery
                </div>

                <div className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
                  <FaHeart className="text-primary" />
                  Trusted by Shoppers
                </div>
              </div>
            </div>
            
            {/* Right Side - Photo Collage */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 h-96">
                {/* Top Left - Large */}
                <div className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2">
                  <img
                    src={images.img1}
                    alt=" "
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute bottom-5 left-5 right-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-sm font-bold">Smart Purchase</div>
                    <div className="text-xs text-white/80">Premium Experience</div>
                  </div>
                </div>
                
                {/* Top Right - Vertical Stack */}
                <div className="space-y-4">
                  <div className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 h-44">
                    <img
                      src={images.img2}
                      alt=" "
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="absolute bottom-5 left-4 right-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-sm font-bold">Safe and Swift Delivery</div>
                      <div className="text-xs text-white/80">Exclusive offers</div>
                    </div>
                  </div>
                  
                  <div className="group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 h-44">
                    <img
                      src={images.img3}
                      alt=" "
                      className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                    <div className="absolute bottom-5 left-4 right-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <div className="text-sm font-bold">Customer Assistance</div>
                      <div className="text-xs text-white/80">Ultimate Quality</div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom - Wide */}
                <div className="col-span-2 group relative overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 h-36">
                  <img
                    src={images.img4}
                    alt=" "
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <div className="absolute bottom-6 left-4 right-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-lg font-bold">Shopmandu Workplace</div>
                    <div className="text-sm text-white/80">Professional setting</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story and Our Mission - Side by Side */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-10">
      <div className="grid gap-12 md:grid-cols-2">
        {/* Our Story */}
        <div className="text-center md:text-left">
          <h2 className="mb-4 text-3xl font-light text-gray-900">
            Our Story
          </h2>

          <div className="mx-auto h-0.5 w-16 bg-primary md:mx-0"></div>

          <div className="mt-8 grid gap-8 text-lg leading-relaxed text-gray-600">
            <p>
              Shopmandu was created with a simple goal: to make online shopping
              easier, safer, and more accessible for everyone. We wanted to build a
              marketplace where customers can discover quality products from trusted
              sellers, all in one convenient place.
            </p>

            <p>
              From fashion and electronics to home essentials and everyday
              necessities, Shopmandu connects buyers with a wide range of products
              while providing a smooth, secure, and enjoyable shopping experience
              from browsing to checkout.
            </p>
          </div>
        </div>

        {/* Our Mission */}
        <div className="rounded-2xl border border-gray-300 bg-gray-50 p-12 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary">
              <FaShoppingBag className="text-xl text-white" />
            </div>

            <h3 className="text-2xl font-light text-gray-900">
              Our Mission
            </h3>
          </div>

          <p className="mb-6 text-lg leading-relaxed text-gray-600">
            Our mission is to empower customers and sellers by creating a reliable,
            transparent, and customer-focused online marketplace. We strive to make
            quality products easily accessible while supporting businesses in
            reaching more people across Nepal.
          </p>

          <div className="border-l-4 border-primary py-2 pl-6">
            <p className="italic text-gray-700">
              "Making online shopping simple, secure, and enjoyable—one order at a
              time."
            </p>
          </div>
        </div>
      </div>
    </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-10">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-light text-gray-900">
            What We Stand For
          </h2>
          <div className="mx-auto h-0.5 w-16 bg-primary"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Trusted Marketplace */}
          <div className="group rounded-lg border border-gray-300 p-6 text-center transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-primary">
              <FaUsers className="text-2xl text-gray-600 transition-colors duration-300 group-hover:text-white" />
            </div>

            <h4 className="mb-3 text-xl font-medium text-gray-900">
              Trusted Marketplace
            </h4>

            <p className="leading-relaxed text-gray-600">
              We connect customers with trusted sellers, creating a safe and reliable
              shopping experience built on transparency and quality.
            </p>
          </div>

          {/* Customer First */}
          <div className="group rounded-lg border border-gray-300 p-6 text-center transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-primary">
              <FaBullseye className="text-2xl text-gray-600 transition-colors duration-300 group-hover:text-white" />
            </div>

            <h4 className="mb-3 text-xl font-medium text-gray-900">
              Customer First
            </h4>

            <p className="leading-relaxed text-gray-600">
              Every feature we build is designed to make shopping faster, easier,
              and more enjoyable for every customer.
            </p>
          </div>

          {/* Quality & Reliability */}
          <div className="group rounded-lg border border-gray-300 p-6 text-center transition-all duration-300 hover:shadow-lg">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors duration-300 group-hover:bg-primary">
              <FaCheckCircle className="text-2xl text-gray-600 transition-colors duration-300 group-hover:text-white" />
            </div>

            <h4 className="mb-3 text-xl font-medium text-gray-900">
              Quality & Reliability
            </h4>

            <p className="leading-relaxed text-gray-600">
              We are committed to providing quality products, secure payments,
              and dependable service that customers can trust every day.
            </p>
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
      `}</style>
    </div>
  );
};

export default AboutPage;