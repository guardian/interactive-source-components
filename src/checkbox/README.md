## Checkbox

```html
<script>
  import "@guardian/interactive-source-components/checkbox.css";
</script>

<div class="src-checkbox__container">
  <input type="checkbox" id="newsletter" class="src-checkbox" />
  <label for="newsletter" class="src-label">
    Subscribe to newsletter
    <div class="src-label__supporting">
      We'll send you updates about new articles
    </div>
  </label>
</div>
```

Use the `src-checkbox` class on `<input type="checkbox">` elements to style checkboxes in the default Guardian style.

You don't need to wrap the checkbox in `<div class="src-checkbox--container">`, but doing so helps align the input with a neighbouring label, as in the example above.

> [!NOTE]  
> Unlike other input fields (such as [Text input](../text-input/README.md)), you don't need to import the `label.css` file to get label styling: checkboxes have their own unique label styles

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-checkbox--docs)&nbsp;&nbsp;<img width="16" src="https://zeroheight.com/favicon.ico" /> [Source design system docs](https://theguardian.design/2a1e5182b/p/437902-text-input-field)

### Accessibility

- Always use a proper `<label>` element associated with the checkbox via the `for` and `id` attributes
- The component includes proper focus states and keyboard navigation
- Supporting text can be added using the `src-label__supporting` class within the label
