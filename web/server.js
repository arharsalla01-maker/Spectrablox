const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spectrablox', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = require('../models/User');
const Brainrot = require('../models/Brainrot');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.discordId);
});

passport.deserializeUser(async (discordId, done) => {
  try {
    const user = await User.findOne({ discordId });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'guilds.join']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ discordId: profile.id });

    if (!user) {
      user = new User({
        discordId: profile.id,
        username: profile.username,
        discriminator: profile.discriminator,
        avatar: profile.avatar,
        accessToken: accessToken,
        refreshToken: refreshToken
      });
    } else {
      user.accessToken = accessToken;
      user.refreshToken = refreshToken;
      user.username = profile.username;
      user.avatar = profile.avatar;
    }

    await user.save();

    // Give REAL role automatically
    const { REST, Routes } = require('discord.js');
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

    try {
      await rest.put(
        Routes.guildMemberRole(process.env.GUILD_ID, profile.id, process.env.REAL_ROLE_ID),
        {}
      );
    } catch (error) {
      console.error('Error giving REAL role:', error);
    }

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback',
  passport.authenticate('discord', {
    failureRedirect: '/login'
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

app.get('/api/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

app.get('/api/brainrots', async (req, res) => {
  try {
    const brainrots = await Brainrot.find().sort({ createdAt: -1 }).limit(50);
    res.json(brainrots);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching brainrots' });
  }
});

app.post('/api/brainrots', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const { robloxId, imageUrl, description } = req.body;

    const brainrot = new Brainrot({
      userId: req.user.discordId,
      username: req.user.username,
      avatar: req.user.avatar,
      robloxId,
      imageUrl,
      description
    });

    await brainrot.save();

    // Add to user's brainrots
    req.user.brainrots.push(brainrot._id);
    await req.user.save();

    res.json(brainrot);
  } catch (error) {
    res.status(500).json({ error: 'Error creating brainrot' });
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

const PORT = process.env.WEB_PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Web server running on port ${PORT}`);
});