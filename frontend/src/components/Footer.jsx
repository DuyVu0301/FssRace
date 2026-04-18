const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">FSS Race</h3>
            <p className="text-sm">
              A virtual racing platform to track your running activities and
              compete with friends.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/races" className="hover:text-white transition">
                  Races
                </a>
              </li>
              <li>
                <a href="/leaderboard" className="hover:text-white transition">
                  Leaderboard
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <p className="text-sm">Email: support@fssrace.com</p>
            <p className="text-sm">Powered by Strava API</p>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-sm">
          <p>&copy; 2024 FSS Race. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
