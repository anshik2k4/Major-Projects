🔐 Authentication & Security Notes

1. Authentication vs Authorization
Authentication = "Kaun ho tum?" — Login verify karna.
User: "Main Anshi hoon" + password
Server: "Haan, sahi hai!" ✅
Authorization = "Tumhe kya permission hai?" — Access control.
Normal User → sirf apna data dekh sakta hai
Admin → saara data dekh sakta hai

2. Passwords kaise store hote hain?
❌ Plain text:  "anshi123"        — kabhi nahi store karte!
✅ Hashed:      "$2b$10$xK9mN..."  — hamesha hashed store karo

3. Hashing kya hai?
Password ko one-way fixed string mein convert karna — jo reverse nahi ho sakti!
"anshi123"  →  bcrypt  →  "$2b$10$xK9mN..."
              ↑ one-way — wapas nahi aa sakta

4. Salting kya hai?
Hash karne se pehle password mein random string (salt) add karna — taaki same passwords ka hash alag alag ho!
"anshi123" + "xK9r#m" (salt) → "$2b$10$xK9..."
"anshi123" + "pL2q#n" (salt) → "$2b$10$pL2..."

// Same password, bilkul alag hash! ✅

5. Passport.js
Node.js ki authentication library — login/signup aasaan banati hai.
javascriptconst passport = require('passport');
const LocalStrategy = require('passport-local');

passport.use(new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username });
    if (!user) return done(null, false);
    // password verify karo
}));