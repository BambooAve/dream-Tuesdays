export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-gray-600">
            © 2024 Goal Platform. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-sm text-gray-600 hover:text-black">
              About
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black">
              Contact
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black">
              Terms
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-black">
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};