# Lambda Man Game - p5.js Project

An asteroids inspired game built with p5.js. This project is set up for local development with minimal dependencies.

## Project Structure

```
lambdaman_game/
├── index.html    # Main HTML file that loads p5.js and your sketch
├── sketch.js     # Your p5.js game code goes here
└── README.md     # This file
```

## Quick Start

### Option 1: Using Python's Built-in Server (Recommended)

If you have Python installed:

**Python 3:**
```bash
python3 -m http.server 8000
```

**Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

Then open your browser to: http://localhost:8000

### Option 2: Using Node.js http-server

If you have Node.js installed:

```bash
# Install http-server globally (one time only)
npm install -g http-server

# Run the server
http-server -p 8000
```

Then open your browser to: http://localhost:8000

### Option 3: Using Visual Studio Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: Direct File Opening (Limited)

You can open `index.html` directly in your browser, but some features may not work due to CORS restrictions.

## Development Workflow

1. **Edit Code**: Make changes to `sketch.js` in your favorite text editor
2. **Save**: Save the file (Cmd+S or Ctrl+S)
3. **Refresh Browser**: Refresh your browser (Cmd+R or Ctrl+R or F5)
4. **View Console**: Open browser DevTools (F12 or Cmd+Option+I or Ctrl+Shift+I) to see console logs

## Debugging Tips

### Browser Developer Tools

1. **Open DevTools**:
   - Chrome/Edge: F12 or Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows/Linux)
   - Firefox: F12 or Cmd+Option+I (Mac) or Ctrl+Shift+I (Windows/Linux)
   - Safari: Enable Developer menu in Preferences, then Cmd+Option+I

2. **Console Tab**: View `console.log()` output and errors
3. **Sources Tab**: Set breakpoints and step through code
4. **Network Tab**: Check if files are loading correctly

### Common Issues

**Blank Screen?**
- Check Console for errors
- Verify `sketch.js` is in the same directory as `index.html`
- Make sure you're accessing via a local server (not file://)

**Changes Not Showing?**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
- Clear browser cache if needed
- Check that you saved the file

**CORS Errors?**
- Use a local server instead of opening the file directly
- Check that all resources are loaded from the same origin

## Adding Your p5.js Code

Replace the placeholder code in `sketch.js` with your p5.js code from the web playground. The basic structure is:

```javascript
function setup() {
    // Runs once at the beginning
    createCanvas(600, 600);
}

function draw() {
    // Runs continuously (60 times per second by default)
    background(0);
    // Your drawing code here
}
```

## Useful p5.js Resources

- [p5.js Reference](https://p5js.org/reference/)
- [p5.js Examples](https://p5js.org/examples/)
- [p5.js Web Editor](https://editor.p5js.org/) (for quick experiments)

## Tips for Beginners

1. **Start Simple**: Get a basic shape drawing before adding complexity
2. **Use console.log()**: Debug by printing values to the console
3. **Save Often**: Keep versions of working code
4. **Comment Your Code**: Explain what each section does
5. **Break It Down**: Separate your code into functions for clarity
