# Template Authoring Guide

## Template Structure

Every template is a directory with four files:

```
my-template/
├── manifest.json        # Metadata + props schema
├── composition.html     # HTML structure
├── style.css            # Scoped CSS
└── animation.js         # GSAP timeline
```

## 1. Manifest (manifest.json)

```json
{
  "id": "my-template",
  "name": "My Template",
  "category": "lower-thirds",
  "description": "A description of what this template does",
  "author": "Your Name",
  "version": "1.0.0",
  "duration": 5,
  "tags": ["tag1", "tag2"],
  "props": {
    "title": {
      "type": "string",
      "required": true,
      "default": "Title",
      "description": "Main title text"
    },
    "color": {
      "type": "color",
      "required": false,
      "default": "#FFFFFF",
      "description": "Title color"
    }
  },
  "files": {
    "composition": "composition.html",
    "style": "style.css",
    "animation": "animation.js"
  }
}
```

### Prop Types

| Type | Description | Example |
|------|-------------|---------|
| `string` | Any text | `"Hello World"` |
| `number` | Numeric value | `48` |
| `boolean` | True/false | `true` |
| `color` | CSS color | `"#FF6B35"` |
| `enum` | Choice from list | `"left"` |
| `file` | File path | `"./logo.png"` |

## 2. Composition (composition.html)

Use `{{propName}}` placeholders for customizable values:

```html
<div class="my-element">
  <h1>{{title}}</h1>
  <p>{{subtitle}}</p>
</div>
```

## 3. Style (style.css)

Use the same `{{propName}}` placeholders in CSS:

```css
.my-element h1 {
  color: {{color}};
  font-size: {{fontSize}}px;
}
```

## 4. Animation (animation.js)

Create a GSAP timeline that is seekable and deterministic:

```javascript
(function() {
  const tl = gsap.timeline({ paused: true });

  // Entrance
  tl.from('.my-element', { opacity: 0, y: 30, duration: 0.5, ease: 'power3.out' }, 0);

  // Exit
  tl.to('.my-element', { opacity: 0, duration: 0.3 }, 4.5);

  // Register with renderer
  if (window.__mf_timeline) {
    window.__mf_timeline.add(tl, 0);
  }
})();
```

## Testing Your Template

```bash
mf template apply my-template --title "Test" --color "#FF0000"
mf preview
```

## Guidelines

- Keep HTML semantic and accessible
- Scope all CSS to avoid global leaks
- Make GSAP timelines seekable (paused + time-based)
- Test at multiple resolutions
- Provide sensible defaults for all props
- Add the template to `templates/catalog.json`
