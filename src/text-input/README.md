## Text input

```html
<script>
  import "@guardian/interactive-source-components/label.css";
  import "@guardian/interactive-source-components/text-input.css";
</script>

<label for="email" class="src-label">
  Email address
  <div class="src-label__supporting">harpreet@example.com</div>
</label>

<input type="email" id="email" class="src-text-input" />
```

Use the `src-text-input` class on `<input>` elements to style them in the default Guardian style.

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-textinput--docs)&nbsp;&nbsp;<img width="16" src="https://zeroheight.com/favicon.ico" /> [Source design system docs](https://theguardian.design/2a1e5182b/p/437902-text-input-field)

### Variants

The following classes are available to configure the size of the label. To use these classes, combine them with `src-text-input`, eg. `<input class="src-text-input src-text-input--small">`.

| Class                         | Description                        | Default |
| ----------------------------- | ---------------------------------- | ------- |
| `src-text-input--medium`      | The default input size.            | ✅      |
| `src-text-input--small`       | A smaller input.                   |         |
| `src-text-input--width-fluid` | Input width matches its container. | ✅      |
| `src-text-input--width-30`    | Input width is 30 characters.      |         |
| `src-text-input--width-10`    | Input width is 10 characters.      |         |
| `src-text-input--width-4`     | Input width is 4 characters.       |         |

### Using with labels

Some of the CSS for this component targets preceding [labels](./src/label/README) elements, namely a `margin-top`
that's sized according to the contents of the label (`src-label__optional`,
`src-label__supporting`).

For these styles to work, make sure your markup matches the example shown above, if possible.

### Accessibility

- Always associate text inputs with a `<label>` using the `for` and `id` attributes
- The component includes proper focus states with a visible blue box-shadow
- Invalid inputs are automatically styled with a red border for visual feedback
- Use appropriate input types (`email`, `tel`, `url`, etc.) to provide the correct keyboard on mobile devices
- Consider using the `required` attribute for mandatory fields
- Provide supporting text via `src-label__supporting` to explain input requirements
