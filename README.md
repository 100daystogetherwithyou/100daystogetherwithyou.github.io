# 💝 Interactive Love Letter Website

A beautiful, interactive 3D card website inspired by love and thoughtfulness. This website features a flippable card animation with a personal letter that can be revealed with smooth transitions.

## ✨ Features

- **3D Card Animation**: Hover over the card to see smooth 3D flip animations
- **Interactive Letter**: Click to reveal a full letter with beautiful styling
- **Audio Integration**: Background music plays when interacted with
- **Responsive Design**: Works beautifully on desktop, tablet, and mobile
- **Elegant Typography**: Uses Google Fonts (Hi Melody & Noto Sans)
- **Smooth Transitions**: All animations are smooth and polished

## 🎯 How to Use

1. **View the Card**: The animated card will drop down when the page loads
2. **Hover Effect**: Hover over the card to see the beautiful 3D flip animation
3. **Read the Letter**: Click "Click here to read my full letter" to open the full letter
4. **Close Letter**: Click "Click here to return back" or press Escape to close
5. **Audio**: Click anywhere to start background music (if you add an audio file)

## 🛠️ Customization

### Personalizing the Content

1. **Edit the Messages**: Open `index.html` and modify:
   - Card text in the `#card-content` sections
   - Letter content in the `#letter-content` section

2. **Add Your Audio**: 
   - Add your audio file to the `media/` folder as `song.mp3`
   - Or change the filename in `index.html` line with `<source src="media/song.mp3"`

3. **Customize Images**:
   - Replace `media/rect1.svg` and `media/rect2.svg` with your own images
   - You can use photos, custom graphics, or keep the gradient backgrounds

### Styling Changes

- **Colors**: Modify the gradients in `style.css` under the `#pg-1`, `#pg-2`, `#pg-3` sections
- **Card Size**: Adjust `--card-width` and `--card-height` CSS variables
- **Fonts**: Change font families in the Google Fonts link and CSS
- **Animation Speed**: Modify transition durations in `style.css`

## 📁 File Structure

```
├── index.html          # Main HTML file with structure and content
├── style.css           # All styling, animations, and responsive design
├── script.js           # JavaScript functionality for interactions
├── media/              # Media assets folder
│   ├── rect1.svg       # Card background image 1
│   ├── rect2.svg       # Card background image 2
│   └── song.mp3        # Background audio (add your own)
└── README.md           # This documentation
```

## 🌐 Deployment

This website is ready to deploy to GitHub Pages:

1. Push all files to your repository
2. Go to Settings > Pages in your GitHub repository
3. Select "Deploy from a branch" and choose `main` branch
4. Your site will be available at `https://yourusername.github.io/repository-name`

## 💡 Tips

- **Mobile-Friendly**: The design automatically adapts to smaller screens
- **Browser Compatibility**: Works in all modern browsers
- **Performance**: Lightweight and fast-loading
- **Accessibility**: Includes keyboard navigation (Escape to close letter)

## 🎨 Inspiration

This website was inspired by interactive greeting cards and the desire to create something special and personal. Perfect for:
- Love letters and romantic messages
- Birthday wishes
- Anniversary celebrations  
- Special announcements
- Friendship appreciation

## 🤝 Contributing

Feel free to fork this project and make it your own! Add features, improve the design, or adapt it for different occasions.

---

Made with ❤️ for creating beautiful, personal web experiences👋

<!--
**100daystogetherwithyou/100daystogetherwithyou** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
