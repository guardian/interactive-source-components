##

```html
<script>
  import "@guardian/interactive-source-components/spinner.css";
</script>

<div
  class="src-spinner src-spinner--small"
  aria-label="Loading content"
  role="status"
></div>
```

Use the `src-spinner` class on a `<div>` element (or other empty element) to draw a loading spinner
in its place.

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-spinner--docs)

### Variants

The following classes are available to configure the size of the label. To use these classes, combine them with `src-label`, eg. `<label class="src-button src-label--small">`.

| Class                 | Description                    | Default |
| --------------------- | ------------------------------ | ------- |
| `src-spinner--medium` | A regular-size spinner (30px). | ✅      |
| `src-spinner--small`  | A smaller spinner (26px).      |         |
| `src-spinner--xsmall` | A very small spinner (20px).   |         |

To change either of the colors of the loading spinner, set the `--fg` and `--bg` CSS variables on the
`src-spinner` element like so.

```html
<div class="src-spinner" style="--bg: #121212; --fg: #ffe500"></div>
```

### Accessibility

- The spinner styles are purely visual and are not accessible to screen readers by default
- Use `role="status"` with an `aria-label` as in the example above, or include visually-hidden text:

  ```html
  <div class="src-spinner" role="status" aria-live="polite">
    <span class="visually-hidden">Loading content</span>
  </div>
  ```

- Consider using `aria-busy="true"` on the container being loaded instead of or alongside the spinner
