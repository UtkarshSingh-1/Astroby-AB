import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
