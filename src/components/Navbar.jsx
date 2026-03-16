'use client';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  const handleSearch = e => {
    e.preventDefault();

    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="text-amber-10 hd-bg-color flex sm:flex-row justify-between  items-center gap-3 sm:gap-0 min-h-20 px-4 sm:px-8 md:px-12 lg:px-20 py-3 sm:py-2 shadow-md relative">
      <div className="left flex justify-baseline sm:justify-center ">
        <Link href="/">
          {/** biome-ignore lint/performance/noImgElement: <> */}
          <img
            src="/logo.svg"
            alt="Highway Delite Logo"
            className="h-5 sm:h-12"
          />
        </Link>
      </div>
      <div className="right  flex gap-2 items-center">
        {/* Menu Button for Mobile */}
        <div className="sm:hidden relative">
          <button
            type="button"
            onClick={toggleMenu}
            className="p-2 rounded-md hover:bg-accent transition duration-200 flex items-center justify-center"
            aria-label="Toggle menu"
            title="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={closeMenu}
                onKeyDown={e => e.key === 'Escape' && closeMenu()}
              />
              {/* Menu */}
              <div className="absolute right-0 top-full mt-2 w-52 hd-bg-secondary rounded-lg shadow-lg z-20 border border-gray-300 overflow-hidden">
                <Link
                  href="/track-booking"
                  onClick={closeMenu}
                  className="block px-4 py-3 hover:hd-bg-tertiary transition duration-200 border-b border-gray-300 font-medium"
                >
                  📦 Track Booking
                </Link>
                <div className="px-4 py-2">
                  <input
                    type="search"
                    name="searchbar-mobile"
                    id="searchbar-mobile"
                    placeholder="Search experiences"
                    className="w-full font-medium text-sm px-3 py-2 rounded"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                  <button
                    type="button"
                    onClick={e => {
                      handleSearch(e);
                      closeMenu();
                    }}
                    className="w-full mt-2 font-medium text-sm px-3 py-2 rounded-md transition duration-200 hover:bg-accent"
                  >
                    Search
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Desktop Search */}
        <Link
          href="/track-booking"
          onClick={closeMenu}
          className="sm:block hd-btn-primary py-2 rounded-md px-1 hidden hover:hd-bg-tertiary transition duration-200 border-gray-300"
        >
          📦 Track Booking
        </Link>
        <input
          type="search"
          name="searchbar"
          id="searchbar"
          placeholder="Search experiences"
          className="hidden sm:block font-medium text-sm px-2 py-1! sm:px-5 sm:h-10  sm:py-2 rounded"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="hidden sm:block font-medium text-sm px-2 py-1 sm:px-5 sm:h-10  sm:py-2 rounded-md transition duration-200 hover:bg-accent sm:w-auto"
        >
          Search
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
