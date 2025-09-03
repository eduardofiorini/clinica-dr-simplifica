import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Globe } from 'lucide-react';

interface LanguageItem {
  code: string;
  name: string;
  flag: string;
}

const languages: LanguageItem[] = [
  { code: 'af', name: 'Afrikaans', flag: '🇿🇦' },
  { code: 'sq', name: 'Albanian', flag: '🇦🇱' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hy', name: 'Armenian', flag: '🇦🇲' },
  { code: 'az', name: 'Azerbaijani', flag: '🇦🇿' },
  { code: 'eu', name: 'Basque', flag: '🇪🇸' },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'bs', name: 'Bosnian', flag: '🇧🇦' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸' },
  { code: 'ceb', name: 'Cebuano', flag: '🇵🇭' },
  { code: 'ny', name: 'Chichewa', flag: '🇲🇼' },
  { code: 'co', name: 'Corsican', flag: '🇫🇷' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'eo', name: 'Esperanto', flag: '🌍' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪' },
  { code: 'tl', name: 'Filipino', flag: '🇵🇭' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'fy', name: 'Frisian', flag: '🇳🇱' },
  { code: 'gl', name: 'Galician', flag: '🇪🇸' },
  { code: 'ka', name: 'Georgian', flag: '🇬🇪' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
  { code: 'ht', name: 'Haitian Creole', flag: '🇭🇹' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'haw', name: 'Hawaiian', flag: '🏝️' },
  { code: 'he', name: 'Hebrew', flag: '🇮🇱' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
  { code: 'hmn', name: 'Hmong', flag: '🇱🇦' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'is', name: 'Icelandic', flag: '🇮🇸' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
  { code: 'ga', name: 'Irish Gaelic', flag: '🇮🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'jw', name: 'Javanese', flag: '🇮🇩' },
  { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
  { code: 'kk', name: 'Kazakh', flag: '🇰🇿' },
  { code: 'km', name: 'Khmer', flag: '🇰🇭' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'ku', name: 'Kurdish (Kurmanji)', flag: '🇹🇷' },
  { code: 'ky', name: 'Kyrgyz', flag: '🇰🇬' },
  { code: 'lo', name: 'Lao', flag: '🇱🇦' },
  { code: 'la', name: 'Latin', flag: '🏛️' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'lb', name: 'Luxembourgish', flag: '🇱🇺' },
  { code: 'mk', name: 'Macedonian', flag: '🇲🇰' },
  { code: 'mg', name: 'Malagasy', flag: '🇲🇬' },
  { code: 'ms', name: 'Malay', flag: '🇲🇾' },
  { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹' },
  { code: 'mi', name: 'Maori', flag: '🇳🇿' },
  { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
  { code: 'mn', name: 'Mongolian', flag: '🇲🇳' },
  { code: 'my', name: 'Myanmar (Burmese)', flag: '🇲🇲' },
  { code: 'ne', name: 'Nepali', flag: '🇳🇵' },
  { code: 'no', name: 'Norwegian', flag: '🇳🇴' },
  { code: 'or', name: 'Odia (Oriya)', flag: '🇮🇳' },
  { code: 'ps', name: 'Pashto', flag: '🇦🇫' },
  { code: 'fa', name: 'Persian', flag: '🇮🇷' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'pt', name: 'Portuguese (Brazil)', flag: '🇧🇷' },
  { code: 'pa', name: 'Punjabi (Gurmukhi)', flag: '🇮🇳' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'sm', name: 'Samoan', flag: '🇼🇸' },
  { code: 'gd', name: 'Scots Gaelic', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { code: 'sr', name: 'Serbian', flag: '🇷🇸' },
  { code: 'st', name: 'Sesotho', flag: '🇱🇸' },
  { code: 'sn', name: 'Shona', flag: '🇿🇼' },
  { code: 'sd', name: 'Sindhi', flag: '🇵🇰' },
  { code: 'si', name: 'Sinhala', flag: '🇱🇰' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'so', name: 'Somali', flag: '🇸🇴' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'su', name: 'Sundanese', flag: '🇮🇩' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'tg', name: 'Tajik', flag: '🇹🇯' },
  { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', flag: '🇮🇳' },
  { code: 'th', name: 'Thai', flag: '🇹🇭' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰' },
  { code: 'ug', name: 'Uyghur', flag: '🇨🇳' },
  { code: 'uz', name: 'Uzbek', flag: '🇺🇿' },
  { code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
  { code: 'cy', name: 'Welsh', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'xh', name: 'Xhosa', flag: '🇿🇦' },
  { code: 'yi', name: 'Yiddish', flag: '🇮🇱' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'zu', name: 'Zulu', flag: '🇿🇦' },
];

interface GoogleTranslateProps {
  variant?: 'default' | 'compact';
}

const GoogleTranslate: React.FC<GoogleTranslateProps> = ({ variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageItem>(languages[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const googleTranslateRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [googleTranslateInitialized, setGoogleTranslateInitialized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let script: HTMLScriptElement | null = null;

    // Check if Google Translate is already loaded
    const initializeGoogleTranslate = () => {
      if (!isMounted) return;
      
      // Only initialize if we have the ref and Google Translate is available
      if (googleTranslateRef.current && (window as any).google?.translate) {
        try {
          new (window as any).google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,af,sq,am,ar,hy,az,eu,be,bn,bs,bg,ca,ceb,ny,zh,zh-tw,co,hr,cs,da,nl,eo,et,tl,fi,fr,fy,gl,ka,de,el,gu,ht,ha,haw,iw,he,hi,hmn,hu,is,ig,id,ga,it,ja,jw,kn,kk,km,ko,ku,ky,lo,la,lv,lt,lb,mk,mg,ms,ml,mt,mi,mr,mn,my,ne,no,or,ps,fa,pl,pt,pa,ro,ru,sm,gd,sr,st,sn,sd,si,sk,sl,so,es,su,sw,sv,tg,ta,te,th,tr,uk,ur,ug,uz,vi,cy,xh,yi,yo,zu',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          }, googleTranslateRef.current);
          
          if (isMounted) {
            setGoogleTranslateInitialized(true);
          }
        } catch (error) {
          console.warn('Google Translate initialization failed:', error);
        }
      }
    };

    // Set up the global callback
    (window as any).googleTranslateElementInit = initializeGoogleTranslate;

    // Load Google Translate script only if not already loaded
    const existingScript = document.querySelector('script[src*="translate.google.com"]');
    if (!existingScript && !(window as any).google?.translate) {
      script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.onerror = () => {
        console.warn('Failed to load Google Translate script');
      };
      
      try {
        document.head.appendChild(script);
      } catch (error) {
        console.warn('Failed to append Google Translate script:', error);
      }
    } else if ((window as any).google?.translate) {
      // Google Translate is already loaded, initialize immediately
      initializeGoogleTranslate();
    }

    // Detect current language on component mount
    detectCurrentLanguage();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      isMounted = false;
      document.removeEventListener('mousedown', handleClickOutside);
      
      // Clean up global callback
      if ((window as any).googleTranslateElementInit === initializeGoogleTranslate) {
        delete (window as any).googleTranslateElementInit;
      }
      
      // Don't remove the script as it might be used by other components
      // Just clean up our specific initialization
    };
  }, []);

  const detectCurrentLanguage = () => {
    let currentLang = 'en';
    
    // Check localStorage for selected language
    const selectedLang = localStorage.getItem('selectedLanguage');
    if (selectedLang && languages.find(lang => lang.code === selectedLang)) {
      currentLang = selectedLang;
    }
    
    // Check for Google Translate hash
    if (currentLang === 'en') {
      const hash = window.location.hash;
      if (hash.includes('googtrans')) {
        const match = hash.match(/googtrans\(en\|(\w+)\)/);
        if (match) {
          currentLang = match[1];
        }
      }
    }
    
    // Update UI with detected language
    const foundLanguage = languages.find(lang => lang.code === currentLang);
    if (foundLanguage) {
      setCurrentLanguage(foundLanguage);
    }
  };

  const translatePage = async (langCode: string) => {
    setIsLoading(true);
    
    try {
      // Set Google Translate cookie
      const expires = new Date();
      expires.setFullYear(expires.getFullYear() + 1);
      document.cookie = `googtrans=/en/${langCode}; expires=${expires.toUTCString()}; path=/`;
      
      // Store language preference in localStorage
      localStorage.setItem('googtrans', `/en/${langCode}`);
      localStorage.setItem('selectedLanguage', langCode);
      
      // Set the URL hash for Google Translate
      if (langCode !== 'en') {
        window.location.hash = `#googtrans(en|${langCode})`;
      } else {
        resetGoogleTranslate();
      }
      
      setIsSuccess(true);
      
      // Use a more reliable method to reload the page
      setTimeout(() => {
        try {
          // First try to reload normally
          window.location.reload();
        } catch (reloadError) {
          // If that fails, try to navigate to the same URL
          window.location.href = window.location.href;
        }
      }, 1000);
      
    } catch (error) {
      console.error('Translation error:', error);
      setIsLoading(false);
      setIsSuccess(false);
    }
  };

  const resetGoogleTranslate = () => {
    // Clear URL hash
    window.location.hash = '';
    
    // Clear localStorage
    localStorage.removeItem('googtrans');
    localStorage.removeItem('selectedLanguage');
    
    // Clear cookies
    const domains = ['', '.localhost', '.' + window.location.hostname, window.location.hostname];
    const paths = ['/', '/en', '', window.location.pathname];
    const cookieNames = ['googtrans', 'googtrans_temp'];
    
    cookieNames.forEach(cookieName => {
      domains.forEach(domain => {
        paths.forEach(path => {
          document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
        });
      });
    });
  };

  const handleLanguageSelect = (language: LanguageItem) => {
    setCurrentLanguage(language);
    setIsOpen(false);
    setSearchTerm('');
    translatePage(language.code);
  };

  const filteredLanguages = languages.filter(language =>
    language.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDropdownOpen = () => {
    setIsOpen(true);
    // Focus search input after a brief delay to ensure it's rendered
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const buttonClasses = variant === 'compact' 
    ? "flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all duration-200 min-w-[100px]"
    : "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:from-purple-600 hover:to-purple-700 hover:border-purple-600 hover:text-white transition-all duration-300 min-w-[140px] shadow-sm hover:shadow-lg hover:-translate-y-0.5";

  const loadingClasses = isLoading ? "opacity-80 pointer-events-none" : "";
  const successClasses = isSuccess ? "bg-gradient-to-r from-green-500 to-green-600 border-green-500 text-white" : "";

  return (
    <div className="relative font-sans" ref={dropdownRef}>
      {/* Custom Translate Button */}
      <button
        onClick={() => isOpen ? setIsOpen(false) : handleDropdownOpen()}
        className={`${buttonClasses} ${loadingClasses} ${successClasses} relative overflow-hidden`}
        disabled={isLoading || isSuccess}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-transparent border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        )}
        
        <Globe className={`h-4 w-4 ${isLoading ? 'opacity-30' : ''}`} />
        <span className={`text-sm font-medium ${isLoading ? 'opacity-30' : ''}`}>
          {isLoading ? 'Loading...' : isSuccess ? 'Translating...' : currentLanguage.name}
        </span>
        <ChevronDown 
          className={`h-3 w-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isLoading ? 'opacity-30' : ''}`} 
        />
      </button>

      {/* Language Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 min-w-[280px] overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-purple-100">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                Select Language ({filteredLanguages.length} languages)
              </span>
            </div>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <div className="py-2 max-h-64 overflow-y-auto google-translate-dropdown">
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gradient-to-r hover:from-purple-600 hover:to-purple-700 hover:text-white transition-all duration-200 group ${
                    currentLanguage.code === language.code 
                      ? 'bg-purple-50 text-purple-700 border-l-4 border-purple-600 font-semibold' 
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{language.flag}</span>
                  <span className="flex-1 text-left text-sm font-medium">{language.name}</span>
                  {currentLanguage.code === language.code && (
                    <span className="text-purple-600 group-hover:text-white">✓</span>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-sm font-medium">No languages found</p>
                <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hidden Google Translate Element */}
      <div ref={googleTranslateRef} style={{ display: 'none' }}></div>
    </div>
  );
};

export default GoogleTranslate; 