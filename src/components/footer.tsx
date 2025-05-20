
import { ThemeToggle } from "./ui/theme-toggle";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-12 bg-secondary/50 dark:bg-secondary/10">
      <div className="container px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-gradient font-heading">Portfolio</h2>
            <p className="text-muted-foreground mt-2">
              Creating immersive web experiences
            </p>
          </div>
          
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:text-purple transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-purple transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-purple transition-colors">
              LinkedIn
            </a>
            <ThemeToggle />
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center md:text-left">
          <p className="text-muted-foreground">
            &copy; {currentYear} Creative Developer Portfolio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
