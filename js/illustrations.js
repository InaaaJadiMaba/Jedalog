// ===========================
// JedaLog - SVG Illustrations
// ===========================

const Illustrations = {

  // Hero: Student relaxing at desk
  heroStudent: `
  <svg viewBox="0 0 480 360" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <!-- Background clouds -->
    <ellipse cx="320" cy="80" rx="120" ry="55" fill="#D6E4FF" opacity="0.7"/>
    <ellipse cx="380" cy="75" rx="80" ry="40" fill="#E8F0FF" opacity="0.8"/>
    <ellipse cx="260" cy="90" rx="70" ry="35" fill="#DAE8FF" opacity="0.6"/>
    <circle cx="170" cy="60" r="35" fill="#E0ECFF" opacity="0.5"/>
    <circle cx="205" cy="55" r="28" fill="#EAF2FF" opacity="0.5"/>
    <!-- Small decorative circles -->
    <circle cx="80" cy="40" r="6" fill="#BFCFFF" opacity="0.6"/>
    <circle cx="95" cy="25" r="4" fill="#BFCFFF" opacity="0.5"/>
    <circle cx="430" cy="50" r="8" fill="#A8BFFF" opacity="0.5"/>
    <circle cx="445" cy="35" r="5" fill="#BFCFFF" opacity="0.4"/>
    <!-- Doodle lines -->
    <path d="M60 120 Q70 110 80 120" stroke="#A8BFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M55 115 Q65 105 75 115" stroke="#A8BFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M430 160 Q440 150 450 160" stroke="#A8BFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Stars/sparkles -->
    <text x="420" y="110" font-size="12" fill="#6B8FD4" opacity="0.6">✦</text>
    <text x="70" y="160" font-size="10" fill="#6B8FD4" opacity="0.5">✦</text>
    <!-- Desk surface -->
    <rect x="90" y="260" width="340" height="14" rx="7" fill="#C8D8F5"/>
    <rect x="90" y="265" width="340" height="9" rx="4" fill="#B8CBF0"/>
    <!-- Laptop -->
    <rect x="140" y="200" width="160" height="100" rx="8" fill="#2A3F70"/>
    <rect x="144" y="204" width="152" height="92" rx="6" fill="#1E3060"/>
    <rect x="144" y="204" width="152" height="92" rx="6" fill="url(#screenGrad)" opacity="0.8"/>
    <defs>
      <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#3164C8" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#102C68" stop-opacity="0.2"/>
      </linearGradient>
    </defs>
    <!-- Laptop screen content -->
    <rect x="156" y="216" width="116" height="6" rx="3" fill="#4A7DD9" opacity="0.5"/>
    <rect x="156" y="228" width="88" height="4" rx="2" fill="#6B9AE0" opacity="0.4"/>
    <rect x="156" y="238" width="100" height="4" rx="2" fill="#6B9AE0" opacity="3"/>
    <!-- Chat bubble on screen -->
    <rect x="168" y="250" width="60" height="30" rx="8" fill="#3164C8" opacity="0.6"/>
    <path d="M188 280 L183 290 L195 280" fill="#3164C8" opacity="0.6"/>
    <rect x="176" y="258" width="44" height="4" rx="2" fill="white" opacity="0.5"/>
    <rect x="176" y="266" width="32" height="4" rx="2" fill="white" opacity="0.4"/>
    <!-- Laptop base -->
    <rect x="120" y="295" width="200" height="12" rx="6" fill="#2A3F70"/>
    <rect x="200" y="300" width="40" height="7" rx="3" fill="#1E3060"/>
    <!-- Books stack -->
    <rect x="305" y="235" width="70" height="16" rx="4" fill="#3164C8"/>
    <rect x="310" y="220" width="65" height="16" rx="4" fill="#4A7DD9"/>
    <rect x="315" y="206" width="60" height="15" rx="4" fill="#102C68"/>
    <!-- Book spines detail -->
    <line x1="320" y1="206" x2="320" y2="221" stroke="#EAF0FF" stroke-width="1.5" opacity="0.4"/>
    <line x1="320" y1="220" x2="320" y2="236" stroke="#EAF0FF" stroke-width="1.5" opacity="0.4"/>
    <line x1="320" y1="235" x2="320" y2="251" stroke="#EAF0FF" stroke-width="1.5" opacity="0.4"/>
    <!-- Mug -->
    <rect x="370" y="245" width="44" height="46" rx="10" fill="white" stroke="#D1DCF5" stroke-width="2"/>
    <path d="M414 258 Q430 258 430 270 Q430 282 414 282" fill="none" stroke="#D1DCF5" stroke-width="2.5" stroke-linecap="round"/>
    <!-- Mug chat icon -->
    <rect x="381" y="260" width="22" height="16" rx="5" fill="#EAF0FF"/>
    <path d="M388 272 L385 278 L393 272" fill="#EAF0FF"/>
    <rect x="385" y="264" width="14" height="2.5" rx="1.2" fill="#3164C8" opacity="0.6"/>
    <rect x="385" y="268" width="10" height="2.5" rx="1.2" fill="#3164C8" opacity="0.5"/>
    <!-- Steam from mug -->
    <path d="M383 245 Q386 238 383 232" stroke="#D1DCF5" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
    <path d="M392" y="243 Q395 236 392 230" stroke="#D1DCF5" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.5"/>
    <!-- Student body: hoodie -->
    <path d="M220 190 Q240 145 260 145 Q280 145 300 190 Q310 220 305 260 L215 260 Q210 220 220 190Z" fill="#1E3060"/>
    <!-- Hoodie pocket -->
    <rect x="234" y="218" width="52" height="28" rx="8" fill="#162848"/>
    <!-- Hood -->
    <path d="M220 190 Q230 170 260 165 Q290 165 300 190" fill="#263D6B"/>
    <!-- Neck -->
    <rect x="250" y="140" width="20" height="22" rx="10" fill="#F5C5A0"/>
    <!-- Head -->
    <ellipse cx="260" cy="118" rx="45" ry="48" fill="#F5C5A0"/>
    <!-- Hair -->
    <path d="M215 100 Q220 70 260 65 Q300 65 305 100 Q300 78 260 75 Q220 78 215 100Z" fill="#1A1A2E"/>
    <path d="M215 100 Q210 115 215 128" fill="#1A1A2E"/>
    <path d="M305 100 Q310 115 305 130" fill="#1A1A2E"/>
    <!-- Hair detail -->
    <path d="M225 80 Q250 68 280 72 Q265 70 250 70 Q235 70 225 80Z" fill="#2A2A3E" opacity="0.5"/>
    <!-- Eyes - closed/peaceful -->
    <path d="M242 115 Q248 110 254 115" stroke="#1A1A2E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M266 115 Q272 110 278 115" stroke="#1A1A2E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Smile -->
    <path d="M250 128 Q260 136 270 128" stroke="#C08060" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Rosy cheeks -->
    <ellipse cx="242" cy="128" rx="9" ry="6" fill="#F4A0A0" opacity="0.35"/>
    <ellipse cx="278" cy="128" rx="9" ry="6" fill="#F4A0A0" opacity="0.35"/>
    <!-- Arms raised behind head -->
    <path d="M220 195 Q195 180 185 160 Q178 148 188 142 Q198 138 205 150 Q212 165 225 175" fill="#1E3060"/>
    <path d="M300 195 Q325 180 335 160 Q342 148 332 142 Q322 138 315 150 Q308 165 295 175" fill="#1E3060"/>
    <!-- Hands behind head -->
    <ellipse cx="188" cy="142" rx="16" ry="12" fill="#F5C5A0"/>
    <ellipse cx="332" cy="142" rx="16" ry="12" fill="#F5C5A0"/>
    <!-- Chair back -->
    <rect x="185" y="265" width="150" height="80" rx="12" fill="#D1DCF5" opacity="0.5"/>
    <rect x="198" y="272" width="124" height="66" rx="8" fill="#C0D0EE" opacity="0.4"/>
    <!-- Small cloud decoration -->
    <ellipse cx="110" cy="200" rx="30" ry="18" fill="#D6E4FF" opacity="0.6"/>
    <ellipse cx="128" cy="196" rx="22" ry="14" fill="#E0EBFF" opacity="0.5"/>
    <!-- Small hearts -->
    <text x="60" y="200" font-size="14" fill="#A8C0FF" opacity="0.7">♡</text>
    <text x="430" y="200" font-size="12" fill="#A8C0FF" opacity="0.6">♡</text>
    <!-- Thought bubble (stress cloud) -->
    <circle cx="320" cy="45" r="12" fill="#C8D4EC" opacity="0.6"/>
    <circle cx="333" cy="38" r="9" fill="#C8D4EC" opacity="0.6"/>
    <circle cx="344" cy="33" r="15" fill="#C8D4EC" opacity="0.6"/>
    <circle cx="360" cy="28" r="12" fill="#C8D4EC" opacity="0.6"/>
    <path d="M333 55 Q340 68 335 72" stroke="#C8D4EC" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
    <!-- Spiral in thought bubble -->
    <path d="M342 35 Q345 30 350 33 Q353 38 348 42 Q343 45 340 40 Q338 35 343 33" fill="none" stroke="#A0B0D4" stroke-width="1.5" opacity="0.8"/>
  </svg>`,

  // About: Student hugging cloud
  aboutStudent: `
  <svg viewBox="0 0 400 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <!-- Background -->
    <ellipse cx="200" cy="180" rx="170" ry="140" fill="#EAF0FF" opacity="0.5"/>
    <!-- Decorative elements -->
    <circle cx="60" cy="80" r="20" fill="#D6E4FF" opacity="0.6"/>
    <circle cx="340" cy="70" r="15" fill="#D6E4FF" opacity="0.5"/>
    <text x="45" y="60" font-size="16" fill="#A8C0FF" opacity="0.7">♡</text>
    <text x="340" y="50" font-size="20" fill="#A8C0FF" opacity="0.6">♡</text>
    <text x="320" y="200" font-size="12" fill="#A8C0FF" opacity="0.5">♡</text>
    <text x="55" y="220" font-size="10" fill="#A8C0FF" opacity="0.5">✦</text>
    <text x="355" y="150" font-size="10" fill="#A8C0FF" opacity="0.5">✦</text>
    <!-- Decorative lines -->
    <path d="M50 150 Q60 140 70 150" stroke="#A8BFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M330 160 Q340 150 350 160" stroke="#A8BFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Cloud (heart-shaped cute) -->
    <ellipse cx="248" cy="148" rx="62" ry="48" fill="white"/>
    <ellipse cx="222" cy="132" rx="30" ry="28" fill="white"/>
    <ellipse cx="272" cy="130" rx="28" ry="26" fill="white"/>
    <!-- Cloud shadow/highlight -->
    <ellipse cx="248" cy="185" rx="52" ry="10" fill="#E0ECFF" opacity="0.4"/>
    <!-- Cloud face: eyes -->
    <ellipse cx="236" cy="148" rx="5" ry="6" fill="#2A3F70"/>
    <ellipse cx="260" cy="148" rx="5" ry="6" fill="#2A3F70"/>
    <!-- Sparkle in eyes -->
    <ellipse cx="238" cy="146" rx="2" ry="2.5" fill="white"/>
    <ellipse cx="262" cy="146" rx="2" ry="2.5" fill="white"/>
    <!-- Cloud smile -->
    <path d="M238 160 Q248 168 258 160" stroke="#2A3F70" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Rosy cheeks on cloud -->
    <ellipse cx="228" cy="160" rx="8" ry="5" fill="#F4A0A0" opacity="0.4"/>
    <ellipse cx="268" cy="160" rx="8" ry="5" fill="#F4A0A0" opacity="0.4"/>
    <!-- Heart on cloud center -->
    <path d="M244 138 Q248 132 252 138 Q256 132 260 138 Q260 145 252 152 Q244 145 244 138Z" fill="#FFA0A0" opacity="0.7"/>
    <!-- Student body -->
    <path d="M168 228 Q175 185 190 180 Q205 175 220 185 Q235 175 248 175 Q258 175 262 185 Q270 185 285 195 Q295 205 290 235 L175 240Z" fill="#1E3060"/>
    <!-- Hoodie pocket detail -->
    <rect x="200" y="205" width="48" height="24" rx="7" fill="#162848"/>
    <!-- Neck -->
    <rect x="215" y="158" width="18" height="22" rx="9" fill="#F5C5A0"/>
    <!-- Head -->
    <ellipse cx="224" cy="135" rx="42" ry="44" fill="#F5C5A0"/>
    <!-- Hair -->
    <path d="M182 120 Q186 90 224 85 Q262 90 266 120 Q262 100 224 96 Q186 100 182 120Z" fill="#1A1A2E"/>
    <path d="M182 120 Q178 132 182 142" fill="#1A1A2E"/>
    <path d="M266 120 Q270 132 266 142" fill="#1A1A2E"/>
    <!-- Face: peaceful eyes -->
    <path d="M207 128 Q213 122 219 128" stroke="#1A1A2E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <path d="M228 128 Q234 122 240 128" stroke="#1A1A2E" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <!-- Smile -->
    <path d="M212 142 Q222 150 232 142" stroke="#C08060" stroke-width="2" fill="none" stroke-linecap="round"/>
    <!-- Cheeks -->
    <ellipse cx="205" cy="140" rx="9" ry="6" fill="#F4A0A0" opacity="0.35"/>
    <ellipse cx="242" cy="140" rx="9" ry="6" fill="#F4A0A0" opacity="0.35"/>
    <!-- Arms hugging cloud -->
    <path d="M175 235 Q165 210 168 190 Q172 178 182 182 Q186 190 190 200 Q200 215 200 228" fill="#1E3060"/>
    <path d="M290 235 Q295 210 288 190 Q282 178 272 182 Q268 190 265 200 Q258 215 258 228" fill="#1E3060"/>
    <!-- Hands around cloud -->
    <ellipse cx="174" cy="188" rx="14" ry="11" fill="#F5C5A0"/>
    <ellipse cx="283" cy="188" rx="14" ry="11" fill="#F5C5A0"/>
    <!-- Small floating hearts -->
    <text x="90" y="130" font-size="18" fill="#FFB0B0" opacity="0.8">♡</text>
    <text x="330" y="110" font-size="14" fill="#FFB0B0" opacity="0.7">♡</text>
    <text x="105" y="200" font-size="10" fill="#B0C8FF" opacity="0.6">♡</text>
  </svg>`,

  // Services: Laptop with chat logo
  servicesLaptop: `
  <svg viewBox="0 0 400 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <!-- Background circles -->
    <circle cx="200" cy="160" r="140" fill="#EAF0FF" opacity="0.4"/>
    <!-- Plant pot -->
    <rect x="318" y="222" width="52" height="58" rx="8" fill="#8B6B4A"/>
    <ellipse cx="344" cy="222" rx="26" ry="8" fill="#A0784E"/>
    <!-- Plant leaves -->
    <path d="M344 222 Q330 190 310 180 Q325 185 340 200" fill="#5A9A5A"/>
    <path d="M344 222 Q360 185 380 175 Q365 185 355 205" fill="#4A8A4A"/>
    <path d="M344 222 Q335 195 320 188" fill="#6AAA6A" opacity="0.7"/>
    <path d="M344 222 Q360 198 375 192" fill="#6AAA6A" opacity="0.7"/>
    <path d="M344 222 Q344 195 344 180 Q340 185 344 200" fill="#5A9A5A" opacity="0.5"/>
    <!-- Laptop base/body -->
    <rect x="60" y="180" width="280" height="14" rx="7" fill="#2A3F70"/>
    <rect x="50" y="194" width="300" height="10" rx="5" fill="#1E3060"/>
    <!-- Laptop screen -->
    <rect x="75" y="55" width="250" height="132" rx="10" fill="#2A3F70"/>
    <rect x="80" y="60" width="240" height="122" rx="8" fill="#1A2C55"/>
    <!-- Screen gradient overlay -->
    <rect x="80" y="60" width="240" height="122" rx="8" fill="url(#laptopScreenGrad)" opacity="0.5"/>
    <defs>
      <linearGradient id="laptopScreenGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3164C8" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#102C68" stop-opacity="0.1"/>
      </linearGradient>
    </defs>
    <!-- Screen content: JedaLog chat UI mockup -->
    <!-- Top bar -->
    <rect x="80" y="60" width="240" height="28" rx="8" fill="#102C68"/>
    <!-- Traffic lights -->
    <circle cx="96" cy="74" r="5" fill="#FF6B6B" opacity="0.8"/>
    <circle cx="110" cy="74" r="5" fill="#FFD93D" opacity="0.8"/>
    <circle cx="124" cy="74" r="5" fill="#6BCB77" opacity="0.8"/>
    <!-- Logo on screen -->
    <rect x="155" y="66" width="90" height="16" rx="4" fill="none"/>
    <text x="175" y="78" font-size="9" fill="white" font-weight="bold" font-family="sans-serif">JedaLog</text>
    <!-- Chat messages -->
    <rect x="92" y="100" width="110" height="22" rx="8" fill="#3164C8"/>
    <rect x="90" y="108" width="112" height="22" rx="8" fill="none"/>
    <rect x="92" y="100" width="110" height="22" rx="8" fill="white" opacity="0.15"/>
    <rect x="178" y="128" width="100" height="22" rx="8" fill="#EAF0FF"/>
    <rect x="92" y="155" width="88" height="18" rx="6" fill="#3164C8" opacity="0.8"/>
    <!-- Chat dots animation effect -->
    <circle cx="108" cy="175" r="3" fill="#3164C8" opacity="0.5"/>
    <circle cx="120" cy="175" r="3" fill="#3164C8" opacity="0.6"/>
    <circle cx="132" cy="175" r="3" fill="#3164C8" opacity="0.5"/>
    <!-- Big chat logo in center screen -->
    <rect x="168" y="88" width="64" height="50" rx="16" fill="#3164C8" opacity="0.9"/>
    <path d="M213 138 L208 148 L220 138" fill="#3164C8" opacity="0.9"/>
    <!-- Chat dots in logo -->
    <circle cx="183" cy="110" r="5" fill="white"/>
    <circle cx="200" cy="110" r="5" fill="white"/>
    <circle cx="217" cy="110" r="5" fill="white"/>
    <!-- Laptop hinge -->
    <rect x="145" y="187" width="110" height="7" rx="3.5" fill="#344A7A"/>
    <!-- Decorative elements -->
    <text x="40" y="120" font-size="18" fill="#A8C0FF" opacity="0.5">♡</text>
    <text x="358" y="100" font-size="14" fill="#A8C0FF" opacity="0.5">✦</text>
    <path d="M30 160 Q40 150 50 160" stroke="#A8BFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M370 200 Q380 190 390 200" stroke="#A8BFFF" stroke-width="2" fill="none" stroke-linecap="round"/>
  </svg>`,

  // Help: Hands holding heart
  helpHeart: `
  <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <!-- Background soft glow -->
    <ellipse cx="200" cy="180" rx="160" ry="110" fill="#EAF0FF" opacity="0.5"/>
    <!-- Decorative circles -->
    <circle cx="60" cy="80" r="25" fill="#D6E4FF" opacity="0.5"/>
    <circle cx="340" cy="70" r="20" fill="#D6E4FF" opacity="0.45"/>
    <text x="45" y="62" font-size="18" fill="#A8C0FF" opacity="0.6">♡</text>
    <text x="330" y="52" font-size="16" fill="#A8C0FF" opacity="0.6">♡</text>
    <text x="55" y="200" font-size="12" fill="#A8C0FF" opacity="0.5">✦</text>
    <text x="345" y="200" font-size="12" fill="#A8C0FF" opacity="0.5">✦</text>
    <!-- Floating hearts around main heart -->
    <text x="190" y="80" font-size="12" fill="#FFB0B0" opacity="0.7">♡</text>
    <text x="155" y="100" font-size="10" fill="#FFB0B0" opacity="0.6">♡</text>
    <text x="235" y="95" font-size="10" fill="#FFB0B0" opacity="0.6">♡</text>
    <!-- Sparkles -->
    <text x="130" y="130" font-size="10" fill="#6B8FD4" opacity="0.6">✦</text>
    <text x="258" y="125" font-size="10" fill="#6B8FD4" opacity="0.6">✦</text>
    <!-- Left hand/arm -->
    <path d="M90 280 Q95 240 110 220 Q125 200 145 195 Q165 192 175 200 Q185 208 185 220 L175 250 L165 270 L155 280Z" fill="#F5C5A0"/>
    <!-- Left hand fingers -->
    <path d="M165 200 Q165 185 170 178 Q175 172 180 178 Q185 185 184 200" fill="#F5C5A0"/>
    <path d="M150 198 Q148 183 153 176 Q158 170 164 176 Q169 183 168 198" fill="#F5C5A0"/>
    <path d="M136 200 Q132 185 137 178 Q142 172 148 178 Q153 185 151 200" fill="#F5C5A0"/>
    <!-- Right hand/arm -->
    <path d="M310 280 Q305 240 290 220 Q275 200 255 195 Q235 192 225 200 Q215 208 215 220 L225 250 L235 270 L245 280Z" fill="#F5C5A0"/>
    <!-- Right hand fingers -->
    <path d="M235 200 Q235 185 230 178 Q225 172 220 178 Q215 185 216 200" fill="#F5C5A0"/>
    <path d="M250 198 Q252 183 247 176 Q242 170 236 176 Q231 183 232 198" fill="#F5C5A0"/>
    <path d="M264 200 Q268 185 263 178 Q258 172 252 178 Q247 185 249 200" fill="#F5C5A0"/>
    <!-- Sleeve left -->
    <path d="M90 280 Q92 250 108 230 L145 225 L175 235 L175 265 L165 280Z" fill="#3164C8" opacity="0.3"/>
    <!-- Sleeve right -->
    <path d="M310 280 Q308 250 292 230 L255 225 L225 235 L225 265 L235 280Z" fill="#3164C8" opacity="0.3"/>
    <!-- Main heart -->
    <path d="M200 145 Q200 115 175 105 Q148 95 140 120 Q132 145 155 168 Q175 188 200 210 Q225 188 245 168 Q268 145 260 120 Q252 95 225 105 Q200 115 200 145Z" fill="#FF6B6B"/>
    <!-- Heart highlight -->
    <ellipse cx="175" cy="125" rx="14" ry="10" fill="white" opacity="0.25" transform="rotate(-20, 175, 125)"/>
    <!-- Heart shadow -->
    <path d="M200 210 Q190 205 180 195 Q165 180 155 168 Q158 172 165 180 Q178 195 200 215" fill="#E05050" opacity="0.3"/>
    <!-- Small blue decorative dots -->
    <circle cx="140" cy="82" r="6" fill="#6B9AE0" opacity="0.5"/>
    <circle cx="260" cy="78" r="5" fill="#6B9AE0" opacity="0.45"/>
    <circle cx="130" cy="165" r="4" fill="#A8C0FF" opacity="0.5"/>
    <circle cx="270" cy="160" r="4" fill="#A8C0FF" opacity="0.5"/>
  </svg>`,

  // Contact: Smartphone with chat
  contactPhone: `
  <svg viewBox="0 0 400 340" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;">
    <!-- Background -->
    <ellipse cx="200" cy="180" rx="170" ry="140" fill="#EAF0FF" opacity="0.4"/>
    <!-- Decorative elements -->
    <text x="55" y="90" font-size="16" fill="#A8C0FF" opacity="0.6">✦</text>
    <text x="340" y="80" font-size="14" fill="#A8C0FF" opacity="0.5">✦</text>
    <!-- Paper plane -->
    <path d="M310 80 L290 110 L305 115 L310 80Z" fill="#3164C8" opacity="0.7"/>
    <path d="M310 80 L270 100 L305 115Z" fill="#4A7DD9" opacity="0.8"/>
    <path d="M305 115 L295 130 L310 80" fill="#3164C8" opacity="0.5"/>
    <!-- Paper plane detail -->
    <path d="M290 108 L305 112" stroke="white" stroke-width="1" opacity="0.5"/>
    <!-- Envelope -->
    <rect x="55" y="150" width="80" height="58" rx="8" fill="white" stroke="#D1DCF5" stroke-width="2"/>
    <path d="M55 158 L95 185 L135 158" fill="none" stroke="#3164C8" stroke-width="2" stroke-linejoin="round"/>
    <path d="M55 195 L80 175" stroke="#D1DCF5" stroke-width="1.5"/>
    <path d="M135 195 L110 175" stroke="#D1DCF5" stroke-width="1.5"/>
    <!-- Phone body -->
    <rect x="135" y="40" width="130" height="240" rx="22" fill="#2A3F70"/>
    <rect x="140" y="45" width="120" height="230" rx="19" fill="#1A2C55"/>
    <!-- Phone screen -->
    <rect x="143" y="60" width="114" height="200" rx="14" fill="#EAF0FF"/>
    <!-- Phone notch -->
    <rect x="178" y="48" width="44" height="8" rx="4" fill="#1A2C55"/>
    <!-- Screen content: Chat UI -->
    <rect x="143" y="60" width="114" height="26" rx="14" fill="#3164C8"/>
    <rect x="143" y="74" width="114" height="12" rx="0" fill="#3164C8"/>
    <!-- Header text -->
    <rect x="162" y="69" width="50" height="6" rx="3" fill="white" opacity="0.7"/>
    <rect x="218" y="68" width="16" height="16" rx="8" fill="white" opacity="0.2"/>
    <!-- Chat messages -->
    <rect x="150" y="95" width="70" height="20" rx="8" fill="#3164C8"/>
    <path d="M158 115 L153 122 L163 115" fill="#3164C8"/>
    <rect x="153" y="100" width="64" height="4" rx="2" fill="white" opacity="0.5"/>
    <rect x="153" y="107" width="48" height="4" rx="2" fill="white" opacity="0.4"/>
    <rect x="185" y="122" width="58" height="18" rx="8" fill="white" stroke="#D1DCF5" stroke-width="1"/>
    <path d="M235 122 L240 117 L245 122" fill="white" stroke="#D1DCF5" stroke-width="1"/>
    <rect x="190" y="127" width="48" height="3.5" rx="1.5" fill="#A0B8D8" opacity="0.7"/>
    <rect x="150" y="148" width="80" height="20" rx="8" fill="#3164C8" opacity="0.85"/>
    <path d="M158 168 L153 175 L163 168" fill="#3164C8" opacity="0.85"/>
    <!-- Typing indicator -->
    <rect x="152" y="175" width="44" height="16" rx="8" fill="#E0ECFF"/>
    <circle cx="162" cy="183" r="3" fill="#8AABCC"/>
    <circle cx="172" cy="183" r="3" fill="#8AABCC"/>
    <circle cx="182" cy="183" r="3" fill="#8AABCC"/>
    <!-- Input bar -->
    <rect x="146" y="196" width="108" height="20" rx="10" fill="white" stroke="#D1DCF5" stroke-width="1.5"/>
    <rect x="152" y="202" width="60" height="4" rx="2" fill="#D1DCF5"/>
    <circle cx="244" cy="206" r="7" fill="#3164C8"/>
    <path d="M241 206 L247 206 M244 203 L244 209" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
    <!-- Home button area -->
    <rect x="175" y="268" width="50" height="5" rx="2.5" fill="#2A3F70"/>
    <!-- Floating hearts -->
    <text x="280" y="160" font-size="16" fill="#FFB0B0" opacity="0.7">♡</text>
    <text x="70" y="130" font-size="12" fill="#A8C0FF" opacity="0.6">♡</text>
    <text x="295" y="220" font-size="10" fill="#A8C0FF" opacity="0.5">✦</text>
    <!-- Plant decoration -->
    <rect x="330" y="240" width="44" height="50" rx="8" fill="#8B6B4A"/>
    <ellipse cx="352" cy="240" rx="22" ry="7" fill="#A0784E"/>
    <path d="M352 240 Q338 210 318 200 Q332 208 347 222" fill="#5A9A5A"/>
    <path d="M352 240 Q368 205 385 198 Q372 208 360 224" fill="#4A8A4A"/>
  </svg>`,

  // Logo icon
  logoIcon: `
  <svg viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;">
    <rect width="38" height="38" rx="10" fill="#3164C8"/>
    <rect x="8" y="10" width="22" height="16" rx="5" fill="white"/>
    <path d="M18 26 L14 32 L23 26" fill="white"/>
    <circle cx="14" cy="18" r="2.5" fill="#3164C8"/>
    <circle cx="19" cy="18" r="2.5" fill="#3164C8"/>
    <circle cx="24" cy="18" r="2.5" fill="#3164C8"/>
  </svg>`
};
