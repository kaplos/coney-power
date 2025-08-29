'use client';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Schedule', href: '#schedule' },
    { name: 'Pricing', href: '#membership' },
    { name: 'Classes', href: '#schedule' },
    { name: 'Contact', href: '#contact' }
  ];

  const socialLinks = [
    { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/coneypow', ariaLabel: 'Follow us on Instagram' },
    // { name: 'Facebook', icon: Facebook, href: '#', ariaLabel: 'Follow us on Facebook' },
    // { name: 'YouTube', icon: Youtube, href: '#', ariaLabel: 'Subscribe to our YouTube channel' }
  ];

  return (
    <footer id="contact" className="bg-black text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-red-700">Coney Power</div>
            <p className="text-gray-300 leading-relaxed">
              Empowering you to achieve your fitness goals through expert guidance and
              state-of-the-art equipment.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-lg p-1"
                    aria-label={social.ariaLabel}
                  >
                    <IconComponent size={24} className='text-red-700' />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin size={18} className="text-red-700" />
                <span>2350 Coney Island Avenue, Brooklyn NY, 11223</span>
              </div>
              {/* <div className="flex items-center gap-3 text-gray-300">
                <Phone size={18} className="text-blue-400" />
                <span>(555) 123-GYMFIT</span>
              </div> */}
              <div className="flex items-center gap-3 text-gray-300">
                <Mail size={18} className="text-red-700" />
                <span>support@coneypower.com</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hours</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex justify-between">
                {/* <span>5:00 AM - 11:00 PM</span> */}
              </div>
              <div className="flex justify-between">
                <span>Mon - Thu:</span>
                <span>6:00 AM - 10:00 PM</span>
              </div> 
               <div className="flex justify-between">
                <span>Friday:</span>
                <span>7:00 AM - 3:00 PM</span>
              </div>
               <div className="flex justify-between">
                <span>Saturday:</span>
                <span>Closed</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>8:00 AM - 1:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 Coney Power. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
