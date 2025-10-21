export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="mb-4 text-gray-900">About</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Safety
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-gray-900">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-gray-900">Community</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Forum
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-teal-600">
                  Sustainability
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2025 VintageVibe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
