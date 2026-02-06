"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Menu, Star, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-red-900 rounded-full flex items-center justify-center">
              <Star className="h-5 w-5 text-amber-400" />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-red-950' : 'text-white'}`}>
              AstrobyAB
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {navItems.map((item) => (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        isScrolled
                          ? 'text-stone-700 hover:text-red-900 hover:bg-red-50'
                          : 'text-white/90 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link href={isAdmin ? '/admin' : '/dashboard'}>
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-2 ${
                      isScrolled ? 'text-stone-700' : 'text-white'
                    }`}
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className={`flex items-center gap-2 ${
                    isScrolled
                      ? 'border-red-900 text-red-900 hover:bg-red-50'
                      : 'border-white text-white hover:bg-white/10'
                  }`}
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/signin">
                  <Button
                    variant="ghost"
                    className={isScrolled ? 'text-stone-700' : 'text-white'}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-red-900 hover:bg-red-800 text-white">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={isScrolled ? 'text-stone-700' : 'text-white'}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-red-950 border-red-900">
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-red-950" />
                  </div>
                  <span className="text-xl font-bold text-white">AstrobyAB</span>
                </div>

                <nav className="flex-1 space-y-2">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="block px-4 py-3 text-red-100 hover:bg-red-900 rounded-lg transition-colors"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <div className="border-t border-red-900 pt-4 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <SheetClose asChild>
                        <Link href={isAdmin ? '/admin' : '/dashboard'}>
                          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-red-950">
                            <User className="h-4 w-4 mr-2" />
                            Dashboard
                          </Button>
                        </Link>
                      </SheetClose>
                      <Button
                        variant="outline"
                        className="w-full border-red-800 text-red-100 hover:bg-red-900"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/signin">
                          <Button
                            variant="outline"
                            className="w-full border-red-800 text-red-100 hover:bg-red-900"
                          >
                            Sign In
                          </Button>
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/signup">
                          <Button className="w-full bg-amber-500 hover:bg-amber-600 text-red-950">
                            Get Started
                          </Button>
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

