## Label

```html
<script>
  import "@guardian/interactive-source-components/label.css";
  import "@guardian/interactive-source-components/text-input.css";
</script>

<label for="email" class="src-label src-label--small">
  Email address
  <div class="src-label__optional">Optional</div>
  <div class="src-label__supporting">harpreet@example.com</div>
</label>

<input type="email" id="email" class="src-text-input" />
```

Use the `src-label` class on `<label>` elements (or other text elements) to style labels associated
with inputs, such as [Text input](./src/text-input/README.md), as shown above.

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-label--docs)&nbsp;&nbsp;<img width="16" src="https://zeroheight.com/favicon.ico" /> [Source design system docs](https://theguardian.design/2a1e5182b/p/437902-text-input-field)

### Variants

The following classes are available to configure the size of the label. To use these classes, combine them with `src-label`, eg. `<label class="src-button src-label--small">`.

| Class               | Description                        | Default |
| ------------------- | ---------------------------------- | ------- |
| `src-label--medium` | Makes the main label regular-size. | ✅      |
| `src-label--small`  | Makes the main label smaller.      |         |

### Sub-elements

The following classes style possible sub-elements of the label. The order of these elements in
your markup may affect how they're rendered: follow the example above if in doubt.

| Class                   | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `src-label__optional`   | Styles the _optional_ label beside the main label.    |
| `src-label__supporting` | Styles the _supporting_ label beneath the main label. |

### Accessibility

- Always use `<label>` elements with proper `for` attributes to associate them with form controls
- Use the `src-label__optional` sub-element to communicate optional fields
