'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';

export const ALL_TIMEZONES = [
  {
    value: 'UTC-12:00 (Baker Island, Howland Island)',
    label: 'UTC-12:00 — Baker Island, Howland Island',
    offset: 'UTC-12',
    region: 'Americas',
    cities: 'Baker Island, Howland Island, IDLW',
    flag: '🌐'
  },
  {
    value: 'UTC-11:00 (American Samoa, Niue, Pago Pago)',
    label: 'UTC-11:00 — American Samoa, Niue, Pago Pago',
    offset: 'UTC-11',
    region: 'Pacific',
    cities: 'Pago Pago, Midway, Niue, Samoa',
    flag: '🇦🇸'
  },
  {
    value: 'UTC-10:00 (Hawaii, Honolulu, Tahiti)',
    label: 'UTC-10:00 — Hawaii (Honolulu), Tahiti',
    offset: 'UTC-10',
    region: 'Pacific',
    cities: 'Honolulu, Hawaii, Papeete, Tahiti, HST',
    flag: '🇺🇸'
  },
  {
    value: 'UTC-09:00 (Alaska - Anchorage, Juneau)',
    label: 'UTC-09:00 — Alaska (Anchorage, Juneau)',
    offset: 'UTC-09',
    region: 'Americas',
    cities: 'Anchorage, Juneau, Fairbanks, Alaska, AKST',
    flag: '🇺🇸'
  },
  {
    value: 'UTC-08:00 (US/Canada PST - Los Angeles, Vancouver, Seattle)',
    label: 'UTC-08:00 — US/Canada PST (Los Angeles, Vancouver, Seattle)',
    offset: 'UTC-08',
    region: 'Americas',
    cities: 'Los Angeles, San Francisco, Vancouver, Seattle, San Diego, Las Vegas, PST',
    flag: '🇺🇸'
  },
  {
    value: 'UTC-07:00 (US/Canada MST - Denver, Phoenix, Calgary)',
    label: 'UTC-07:00 — US/Canada MST (Denver, Phoenix, Calgary, Salt Lake)',
    offset: 'UTC-07',
    region: 'Americas',
    cities: 'Denver, Phoenix, Calgary, Salt Lake City, Edmonton, MST',
    flag: '🇺🇸'
  },
  {
    value: 'UTC-06:00 (US/Canada CST - Chicago, Houston, Dallas, Mexico City)',
    label: 'UTC-06:00 — US/Canada CST (Chicago, Houston, Dallas, Mexico City)',
    offset: 'UTC-06',
    region: 'Americas',
    cities: 'Chicago, Houston, Dallas, Austin, San Antonio, Mexico City, Winnipeg, CST',
    flag: '🇺🇸'
  },
  {
    value: 'UTC-05:00 (US/Canada EST - New York, Toronto, Miami, Atlanta)',
    label: 'UTC-05:00 — US/Canada EST (New York, Toronto, Miami, Atlanta, Boston)',
    offset: 'UTC-05',
    region: 'Americas',
    cities: 'New York, Toronto, Miami, Atlanta, Boston, Montreal, Washington DC, Bogota, Lima, EST',
    flag: '🇺🇸'
  },
  {
    value: 'UTC-04:00 (Atlantic / Caribbean - Halifax, Caracas, Santiago)',
    label: 'UTC-04:00 — Atlantic / Caribbean (Halifax, Caracas, Santiago, San Juan)',
    offset: 'UTC-04',
    region: 'Americas',
    cities: 'Halifax, Caracas, Santiago, Santo Domingo, San Juan, La Paz, AST',
    flag: '🇨🇦'
  },
  {
    value: 'UTC-03:30 (Newfoundland - St. Johns)',
    label: 'UTC-03:30 — Newfoundland (St. John\'s)',
    offset: 'UTC-03:30',
    region: 'Americas',
    cities: 'St. John\'s, Newfoundland, NST',
    flag: '🇨🇦'
  },
  {
    value: 'UTC-03:00 (South America - Buenos Aires, Sao Paulo, Rio)',
    label: 'UTC-03:00 — South America (Buenos Aires, São Paulo, Rio, Montevideo)',
    offset: 'UTC-03',
    region: 'Americas',
    cities: 'Buenos Aires, Sao Paulo, Rio de Janeiro, Montevideo, Brasilia, Santiago, ART, BRT',
    flag: '🇧🇷'
  },
  {
    value: 'UTC-02:00 (Mid-Atlantic, Fernando de Noronha)',
    label: 'UTC-02:00 — Mid-Atlantic, Fernando de Noronha, South Georgia',
    offset: 'UTC-02',
    region: 'Atlantic',
    cities: 'Fernando de Noronha, South Georgia',
    flag: '🌐'
  },
  {
    value: 'UTC-01:00 (Cape Verde, Azores, Praia)',
    label: 'UTC-01:00 — Cape Verde, Azores, Praia',
    offset: 'UTC-01',
    region: 'Atlantic',
    cities: 'Cape Verde, Azores, Praia, Ponta Delgada',
    flag: '🇨🇻'
  },
  {
    value: 'UTC+00:00 (UK / West Europe GMT - London, Dublin, Lisbon, Casablanca)',
    label: 'UTC+00:00 — UK & West Europe (London, Dublin, Lisbon, Casablanca)',
    offset: 'UTC+0',
    region: 'Europe & UK',
    cities: 'London, Manchester, Birmingham, Dublin, Edinburgh, Lisbon, Casablanca, Rabat, Accra, Reykjavik, GMT, WET',
    flag: '🇬🇧'
  },
  {
    value: 'UTC+01:00 (Central Europe CET - Paris, Berlin, Rome, Madrid, Amsterdam)',
    label: 'UTC+01:00 — Central Europe (Paris, Berlin, Rome, Madrid, Amsterdam, Brussels)',
    offset: 'UTC+1',
    region: 'Europe & UK',
    cities: 'Paris, Berlin, Rome, Madrid, Amsterdam, Brussels, Vienna, Warsaw, Zurich, Stockholm, Lagos, Algiers, Tunis, CET, WAT',
    flag: '🇪🇺'
  },
  {
    value: 'UTC+02:00 (Eastern Europe / Egypt EET - Cairo, Johannesburg, Athens, Beirut)',
    label: 'UTC+02:00 — Egypt & East Europe (Cairo, Johannesburg, Athens, Beirut, Jerusalem)',
    offset: 'UTC+2',
    region: 'Middle East & Africa',
    cities: 'Cairo, Alexandria, Giza, Johannesburg, Cape Town, Athens, Bucharest, Beirut, Jerusalem, Amman, Khartoum, Tripoli, EET, CAT',
    flag: '🇪🇬'
  },
  {
    value: 'UTC+03:00 (Arabia AST - Makkah, Madinah, Riyadh, Jeddah, Doha, Kuwait, Istanbul)',
    label: 'UTC+03:00 — Arabia (Makkah, Madinah, Riyadh, Doha, Kuwait, Istanbul, Nairobi)',
    offset: 'UTC+3',
    region: 'Middle East & Africa',
    cities: 'Makkah, Mecca, Madinah, Medina, Riyadh, Jeddah, Doha, Kuwait City, Manama, Istanbul, Ankara, Baghdad, Nairobi, Addis Ababa, Moscow, AST, EAT',
    flag: '🇸🇦'
  },
  {
    value: 'UTC+03:30 (Iran IRST - Tehran, Mashhad, Isfahan)',
    label: 'UTC+03:30 — Iran (Tehran, Mashhad, Isfahan)',
    offset: 'UTC+3:30',
    region: 'Middle East & Africa',
    cities: 'Tehran, Mashhad, Isfahan, Shiraz, Tabriz, IRST',
    flag: '🇮🇷'
  },
  {
    value: 'UTC+04:00 (Gulf GST - Dubai, Abu Dhabi, Muscat, Baku)',
    label: 'UTC+04:00 — Gulf GST (Dubai, Abu Dhabi, Sharjah, Muscat, Baku)',
    offset: 'UTC+4',
    region: 'Middle East & Africa',
    cities: 'Dubai, Abu Dhabi, Sharjah, Ajman, Muscat, Salalah, Baku, Tbilisi, Yerevan, GST',
    flag: '🇦🇪'
  },
  {
    value: 'UTC+04:30 (Afghanistan AFT - Kabul, Herat, Kandahar)',
    label: 'UTC+04:30 — Afghanistan (Kabul, Herat, Kandahar)',
    offset: 'UTC+4:30',
    region: 'Central Asia',
    cities: 'Kabul, Herat, Kandahar, Mazar-i-Sharif, AFT',
    flag: '🇦🇫'
  },
  {
    value: 'UTC+05:00 (Pakistan PKT - Karachi, Lahore, Islamabad, Tashkent)',
    label: 'UTC+05:00 — Pakistan & Central Asia (Karachi, Lahore, Islamabad, Tashkent)',
    offset: 'UTC+5',
    region: 'South & Central Asia',
    cities: 'Karachi, Lahore, Islamabad, Rawalpindi, Faisalabad, Peshawar, Tashkent, Samarkand, Ashgabat, Dushanbe, PKT, UZT',
    flag: '🇵🇰'
  },
  {
    value: 'UTC+05:30 (India / Sri Lanka IST - Mumbai, New Delhi, Bengaluru, Colombo)',
    label: 'UTC+05:30 — India & Sri Lanka (Mumbai, New Delhi, Bengaluru, Colombo)',
    offset: 'UTC+5:30',
    region: 'South & Central Asia',
    cities: 'Mumbai, New Delhi, Delhi, Bengaluru, Bangalore, Hyderabad, Chennai, Kolkata, Ahmedabad, Pune, Colombo, IST',
    flag: '🇮🇳'
  },
  {
    value: 'UTC+05:45 (Nepal NPT - Kathmandu, Pokhara)',
    label: 'UTC+05:45 — Nepal (Kathmandu, Pokhara)',
    offset: 'UTC+5:45',
    region: 'South & Central Asia',
    cities: 'Kathmandu, Pokhara, Lalitpur, NPT',
    flag: '🇳🇵'
  },
  {
    value: 'UTC+06:00 (Bangladesh BST - Dhaka, Chittagong, Almaty)',
    label: 'UTC+06:00 — Bangladesh (Dhaka, Chittagong, Sylhet, Almaty, Astana)',
    offset: 'UTC+6',
    region: 'South & Central Asia',
    cities: 'Dhaka, Chittagong, Sylhet, Rajshahi, Khulna, Almaty, Astana, Nur-Sultan, Bishkek, BST, ALMT',
    flag: '🇧🇩'
  },
  {
    value: 'UTC+06:30 (Myanmar MMT - Yangon, Mandalay)',
    label: 'UTC+06:30 — Myanmar (Yangon, Mandalay, Naypyidaw)',
    offset: 'UTC+6:30',
    region: 'Southeast Asia',
    cities: 'Yangon, Rangoon, Mandalay, Naypyidaw, MMT',
    flag: '🇲🇲'
  },
  {
    value: 'UTC+07:00 (Southeast Asia WIB - Jakarta, Bangkok, Hanoi, Ho Chi Minh)',
    label: 'UTC+07:00 — Southeast Asia (Jakarta, Surabaya, Bangkok, Hanoi, Ho Chi Minh)',
    offset: 'UTC+7',
    region: 'Southeast Asia',
    cities: 'Jakarta, Surabaya, Bandung, Medan, Bangkok, Hanoi, Ho Chi Minh City, Saigon, Phnom Penh, Vientiane, WIB, ICT',
    flag: '🇮🇩'
  },
  {
    value: 'UTC+08:00 (Singapore / Malaysia SGT - Kuala Lumpur, Singapore, Beijing, Perth)',
    label: 'UTC+08:00 — Singapore & Malaysia (Kuala Lumpur, Singapore, Beijing, Perth, Manila)',
    offset: 'UTC+8',
    region: 'Southeast Asia',
    cities: 'Kuala Lumpur, KL, Penang, Johor Bahru, Singapore, Hong Kong, Beijing, Shanghai, Guangzhou, Shenzhen, Taipei, Manila, Perth, SGT, MYT, CST, AWST',
    flag: '🇲🇾'
  },
  {
    value: 'UTC+08:45 (Australia CWST - Eucla)',
    label: 'UTC+08:45 — Australia Central Western (Eucla, Caiguna)',
    offset: 'UTC+8:45',
    region: 'Australia & Pacific',
    cities: 'Eucla, Caiguna, Border Village, CWST',
    flag: '🇦🇺'
  },
  {
    value: 'UTC+09:00 (Japan / Korea JST - Tokyo, Osaka, Seoul, Busan)',
    label: 'UTC+09:00 — Japan & Korea (Tokyo, Osaka, Kyoto, Seoul, Busan)',
    offset: 'UTC+9',
    region: 'East Asia',
    cities: 'Tokyo, Osaka, Kyoto, Yokohama, Nagoya, Seoul, Busan, Incheon, Pyongyang, JST, KST',
    flag: '🇯🇵'
  },
  {
    value: 'UTC+09:30 (Australia Central ACST - Adelaide, Darwin)',
    label: 'UTC+09:30 — Australia Central (Adelaide, Darwin)',
    offset: 'UTC+9:30',
    region: 'Australia & Pacific',
    cities: 'Adelaide, Darwin, Alice Springs, Broken Hill, ACST',
    flag: '🇦🇺'
  },
  {
    value: 'UTC+10:00 (Australia Eastern AEST - Sydney, Melbourne, Brisbane)',
    label: 'UTC+10:00 — Australia Eastern (Sydney, Melbourne, Brisbane, Canberra)',
    offset: 'UTC+10',
    region: 'Australia & Pacific',
    cities: 'Sydney, Melbourne, Brisbane, Canberra, Gold Coast, Hobart, Cairns, Port Moresby, Guam, AEST',
    flag: '🇦🇺'
  },
  {
    value: 'UTC+10:30 (Australia LHST - Lord Howe Island)',
    label: 'UTC+10:30 — Lord Howe Island',
    offset: 'UTC+10:30',
    region: 'Australia & Pacific',
    cities: 'Lord Howe Island, LHST',
    flag: '🇦🇺'
  },
  {
    value: 'UTC+11:00 (Solomon Islands, New Caledonia, Vladivostok)',
    label: 'UTC+11:00 — Solomon Islands, New Caledonia, Vladivostok',
    offset: 'UTC+11',
    region: 'Australia & Pacific',
    cities: 'Honiara, Noumea, Vladivostok, Magadan, SBT',
    flag: '🇸🇧'
  },
  {
    value: 'UTC+12:00 (New Zealand NZST - Auckland, Wellington, Christchurch, Fiji)',
    label: 'UTC+12:00 — New Zealand (Auckland, Wellington, Christchurch, Fiji)',
    offset: 'UTC+12',
    region: 'Australia & Pacific',
    cities: 'Auckland, Wellington, Christchurch, Hamilton, Suva, Fiji, NZST',
    flag: '🇳🇿'
  },
  {
    value: 'UTC+12:45 (Chatham Islands CHAST)',
    label: 'UTC+12:45 — Chatham Islands',
    offset: 'UTC+12:45',
    region: 'Australia & Pacific',
    cities: 'Chatham Islands, Waitangi, CHAST',
    flag: '🇳🇿'
  },
  {
    value: 'UTC+13:00 (Samoa, Tonga, Tokelau - Apia, Nuku\'alofa)',
    label: 'UTC+13:00 — Samoa & Tonga (Apia, Nuku\'alofa)',
    offset: 'UTC+13',
    region: 'Pacific',
    cities: 'Apia, Samoa, Nuku\'alofa, Tonga, Fakaofo, Tokelau, WST',
    flag: '🇼🇸'
  },
  {
    value: 'UTC+14:00 (Line Islands, Kiritimati)',
    label: 'UTC+14:00 — Line Islands (Kiritimati, Christmas Island)',
    offset: 'UTC+14',
    region: 'Pacific',
    cities: 'Kiritimati, Christmas Island, Line Islands, LINT',
    flag: '🇰🇮'
  }
];

export default function TimezoneSelect({ value, onChange, id = 'field-timezone' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const activeItemRef = useRef(null);
  const scrollListRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle inside scrolling via mouse wheel and two-finger touchpad gestures
  useEffect(() => {
    const el = scrollListRef.current;
    if (!el || !isOpen) return;

    const onWheel = (e) => {
      e.stopPropagation();
      const { scrollTop, scrollHeight, clientHeight } = el;
      const canScrollDown = e.deltaY > 0 && scrollTop + clientHeight < scrollHeight;
      const canScrollUp = e.deltaY < 0 && scrollTop > 0;

      if (canScrollDown || canScrollUp) {
        e.preventDefault();
        el.scrollTop += e.deltaY;
      }
    };

    const onTouchMove = (e) => {
      e.stopPropagation();
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchmove', onTouchMove);
    };
  }, [isOpen]);

  // Detect available space and focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      if (dropdownRef.current) {
        const rect = dropdownRef.current.getBoundingClientRect();
        const parentCard = dropdownRef.current.closest('.book-session-card') || dropdownRef.current.closest('.session-form-card') || dropdownRef.current.closest('.modal-card');
        let spaceBelow = window.innerHeight - rect.bottom;
        if (parentCard) {
          const parentRect = parentCard.getBoundingClientRect();
          spaceBelow = Math.min(spaceBelow, parentRect.bottom - rect.bottom);
        }
        setOpenUpward(spaceBelow < 320);
      }

      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
        if (activeItemRef.current) {
          activeItemRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 50);
    } else {
      setSearchQuery('');
      setSelectedRegion('All');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Find currently selected item object
  const currentItem = useMemo(() => {
    if (!value) return ALL_TIMEZONES[13]; // Default London UTC+0
    return (
      ALL_TIMEZONES.find((tz) => tz.value === value) ||
      ALL_TIMEZONES.find((tz) => tz.value.includes(value) || value.includes(tz.offset)) ||
      ALL_TIMEZONES[13]
    );
  }, [value]);

  // Available regions for quick filter tabs
  const regions = ['All', 'Middle East & Africa', 'Europe & UK', 'Americas', 'South & Central Asia', 'Southeast Asia', 'Australia & Pacific'];

  // Filtered list based on search and region filter
  const filteredTimezones = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return ALL_TIMEZONES.filter((tz) => {
      // Region filter
      if (selectedRegion !== 'All' && tz.region !== selectedRegion) {
        return false;
      }
      if (!q) return true;
      return (
        tz.label.toLowerCase().includes(q) ||
        tz.cities.toLowerCase().includes(q) ||
        tz.offset.toLowerCase().includes(q) ||
        tz.value.toLowerCase().includes(q) ||
        tz.region.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedRegion]);

  const handleSelect = (tzValue) => {
    onChange({ target: { name: 'timezone', value: tzValue } });
    setIsOpen(false);
  };

  return (
    <div className="tz-combobox-wrapper" ref={dropdownRef} data-lenis-prevent="true">
      {/* Hidden input to ensure native form submission compatibility */}
      <input type="hidden" id={id} name="timezone" value={value} />

      {/* Main Trigger Button */}
      <button
        type="button"
        id={`${id}-trigger`}
        className={`tz-combobox-trigger ${isOpen ? 'is-open' : ''}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="tz-trigger-left">
          <span className="tz-trigger-flag">{currentItem?.flag || '🌐'}</span>
          <span className="tz-trigger-text" title={currentItem?.label}>
            {currentItem?.offset} ({currentItem?.cities?.split(',')[0]}...)
          </span>
        </div>
        <div className="tz-trigger-right">
          <span className={`tz-chevron-icon ${isOpen ? 'rotate' : ''}`}>▾</span>
        </div>
      </button>

      {/* Searchable Dropdown Overlay */}
      {isOpen && (
        <div
          className={`tz-dropdown-panel ${openUpward ? 'open-upward' : ''}`}
          role="listbox"
          data-lenis-prevent="true"
        >
          {/* Header with Search Box */}
          <div className="tz-search-header">
            <div className="tz-search-input-wrap">
              <span className="tz-search-icon">🔍</span>
              <input
                ref={searchInputRef}
                type="text"
                className="tz-search-input"
                placeholder="Search city, country, or UTC..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="tz-search-clear"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Quick Filter Region Pills */}
            <div className="tz-region-pills-row" data-lenis-prevent="true">
              {regions.map((reg) => (
                <button
                  type="button"
                  key={reg}
                  className={`tz-region-pill ${selectedRegion === reg ? 'active' : ''}`}
                  onClick={() => setSelectedRegion(reg)}
                >
                  {reg === 'All' ? '✦ All' : reg.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Timezone List System */}
          <div
            ref={scrollListRef}
            className="tz-options-scroll-list"
            data-lenis-prevent="true"
          >
            {filteredTimezones.length > 0 ? (
              filteredTimezones.map((tz) => {
                const isSelected = tz.value === value || currentItem?.value === tz.value;
                return (
                  <div
                    key={tz.value}
                    ref={isSelected ? activeItemRef : null}
                    className={`tz-option-item ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(tz.value)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="tz-item-left">
                      <span className="tz-item-flag">{tz.flag}</span>
                      <div className="tz-item-text-group">
                        <div className="tz-item-top">
                          <strong className="tz-item-offset">{tz.offset}</strong>
                          <span className="tz-item-region-badge">{tz.region}</span>
                        </div>
                        <span className="tz-item-cities">{tz.cities}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="tz-item-check" title="Currently Selected">
                        <span>✓</span>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="tz-no-results">
                <span className="tz-no-results-icon">🌍</span>
                <p className="tz-no-results-text">No timezones matching &quot;{searchQuery}&quot;</p>
                <button
                  type="button"
                  className="tz-reset-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('All');
                  }}
                >
                  Reset search filter
                </button>
              </div>
            )}
          </div>

          {/* Footer Status Bar */}
          <div className="tz-dropdown-footer">
            <span>Showing {filteredTimezones.length} of {ALL_TIMEZONES.length} global time zones</span>
          </div>
        </div>
      )}
    </div>
  );
}
