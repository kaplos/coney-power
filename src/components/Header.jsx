'use client'
import { useState,useRef,useEffect } from 'react';
import { LogIn, Menu, X, User} from 'lucide-react';
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {data: session} = useSession()
    const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Membership', href: '#membership' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
  ];
 useEffect(() => {
    if (!isDropdownOpen) return;
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);
  return (
    <header className="sticky top-0 z-50 bg-black shadow-lg border-b border-gray-100">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-blue-600">
            <img src="/icon.jpeg" alt="Coney Power Logo" className="h-14 w-auto"/>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-white hover:text-[#C5A572] font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C5A572] focus:ring-offset-2 rounded-sm px-2 py-1"
              >
                {item.name}
              </a>
            ))}
            
            <div className="relative">
              {session ? (
                <div
                  className="flex items-center rounded-md bg-[#C5A572] cursor-pointer relative"
                  onClick={() => setIsDropdownOpen((v) => !v)}
                >
                  {/* <img src={session.user.image} alt="User Avatar" className="h-8 w-8 rounded-full"/> */}
                  <User className="text-white rounded-md" />
                  <span className="text-white hover:text-[#534631] font-medium transition-colors duration-200 rounded-sm px-2 py-1">
                    {session.user.name}
                  </span>
                  {/* Dropdown positioned directly under the button */}
                  {isDropdownOpen && (
                    <div ref={dropdownRef} className="absolute left-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                      <div>
                        <label className="block px-4 pt-2 pb-1 text-xs text-black font-semibold cursor-default">
                          Membership:
                        </label>
                        <div className="flex items-center px-4 pb-2 border-b border-gray-200">
                          <span
                            className={`h-3 w-3 rounded-full inline-block ${
                              session.user.subscriptionStatus === 'Active'
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }`}
                            title={session.user.subscriptionStatus === 'Active' ? 'Active' : 'Not Active'}
                          ></span>
                          <span className="ml-2 text-sm text-gray-700 cursor-default">
                            {session.user.membershipName}
                          </span>
                        </div>
                       
                      </div>
                      <button
                        onClick={() => signOut()}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                 <div onClick={() => router.push('/signup')} className="flex items-center gap-2 cursor-pointer">
                  <button className="p-2 rounded-md text-gray-700 bg-[#C5A572] cursor-pointer">
                    <span className="text-white hover:text-[#534631] font-medium transition-colors duration-200 rounded-sm px-2 py-1">
                      Sign In/Sign Up
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className=" md:hidden mt-4 py-4 border-t border-gray-200 animate-fade-in">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white hover:text-[#C5A572] font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#C5A572] focus:ring-offset-2 rounded-sm px-2 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
                
              ))}
                {session ? (
                  <div onClick={() => {signOut(); }} className="flex items-center gap-2 cursor-pointer">
                    <button className="rounded-md text-gray-700 p-2 bg-[#C5A572]">
                      <span className="text-white hover:text-[#534631] font-medium transition-colors duration-200 rounded-sm px-2 py-1">
                        Log Out
                      </span>
                    </button>
                  </div>
                ) : (
                  <div onClick={() =>router.push('/signup')} className="flex items-center gap-2 cursor-pointer">
                    <button className="rounded-md text-gray-700 p-2 bg-[#C5A572]">
                      <span className="text-white hover:text-[#534631] font-medium transition-colors duration-200 rounded-sm px-2 py-1">
                        Sign In/Sign Up
                      </span>
                    </button>
                  </div>
                )}
              </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
