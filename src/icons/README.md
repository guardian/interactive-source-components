## Icons

```html
<script>
  import "@guardian/interactive-source-components/icons.css";
</script>

<div class="src-icon--add-to-basket" style="width: 36px;"></div>
```

Add `src-icon--add-to-basket` (changing `add-to-basket` to the name of your desired icon) to a
`<div>` or other empty element, to replace it with the named icon.

See the full icon library in Figma for a reference of available icons.

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-icons--docs)&nbsp;&nbsp;<img width="16" src="https://zeroheight.com/favicon.ico" /> [Source design system docs](https://theguardian.design/2a1e5182b/p/96fb61-iconography)&nbsp;&nbsp;<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" />[Figma icon library](https://www.figma.com/design/b2qv2OMLoNCYnP01ipfrP7/%E2%97%88-Core-library?node-id=3280-5287&p=f&t=RXcikIx4EGw6J7V4-0)

### How it works

Icon classes will draw an icon into the given element using `mask-image` and a data URL containing
the SVG markup, like so.

<!-- prettier-ignore -->
```css
mask-image: url(
  data:image/svg+xml,
  %3Csvgxmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"%3E%3Cpathd="..."/%3E%3C/svg%3E
);
```

The color of the icon is given by `background-color`, which is
[`currentcolor`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#currentcolor_keyword) by default.

### Accessibility

- Make sure to set an appropriate `role` and `aria-label` on your element if the icon should be exposed to screenreaders.
