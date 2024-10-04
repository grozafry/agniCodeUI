const Logo = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 50" className="h-16 w-auto">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor:"#3B82F6", stopOpacity:1}} />
          <stop offset="50%" style={{stopColor:"#8B5CF6", stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:"#EC4899", stopOpacity:1}} />
        </linearGradient>
      </defs>
      
      <path d="M30 10 L50 10 L60 20 L50 30 L30 30 L20 20 Z" fill="url(#gradient)" />
      <circle cx="40" cy="20" r="5" fill="#ffffff" />
      
      <path d="M10 15 L20 25 L10 35" stroke="url(#gradient)" strokeWidth="3" fill="none" />
      <path d="M70 15 L60 25 L70 35" stroke="url(#gradient)" strokeWidth="3" fill="none" />
      
      <text x="85" y="35" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="url(#gradient)">Reveu.AI</text>
    </svg>
  );

export default Logo;