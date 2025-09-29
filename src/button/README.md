## Buttons

```html
<script>
  import "@guardian/interactive-source-components/button.css";
</script>

<button class="src-button">Click me</button>
```

Use the `src-button` class to style your buttons in the default Guardian style. By default, buttons
are `medium` sized, and use the `primary` priority.

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-button--docs)&nbsp;&nbsp;<img style="margin-bottom: -3px" width="18" src="https://zeroheight.com/favicon.ico" /> [Source design system docs](https://theguardian.design/2a1e5182b/p/435225-button)

### Variants

The following classes are available to configure the style and size of the button. To use these classes, combine them with src-button, eg. `<button class="src-button src-button--tertiary">`.

| Class                   | Description                                         | Default |
| ----------------------- | --------------------------------------------------- | ------- |
| `src-button--default`   | Dark background, light text.                        | ✅      |
| `src-button--secondary` | Pale background, dark text.                         |         |
| `src-button--tertiary`  | Transparent background, dark border and text.       |         |
| `src-button--subdued`   | Transparent background, no border, underlined text. |         |
| `src-button--medium`    | Smaller than normal.                                | ✅      |
| `src-button--small`     | Smaller than normal.                                |         |
| `src-button--xsmall`    | Extra-smaller than normal.                          |         |

Note that many of Button's features in Source (icons, loading state, etc.) are not currently
supported.

### Accessibility

- The component includes proper focus states with a visible outline
- Use semantic `<button>` elements for actions and `<a>` elements styled as buttons for navigation
- Always provide descriptive text content for buttons
- The `:disabled` state includes proper cursor styling
- Keyboard navigation is fully supported
