# Interactive Source components

An NPM package containing simplified CSS-only versions of the React components made available in the [@guardian/source](https://github.com/guardian/csnx/tree/main/libs/%40guardian/source) library.

> [!NOTE]  
> This library is very young and likely to see significant breaking changes.
> Reach out to ed.gargan@guardian.co.uk with any queries.

## Getting started

Install the package using NPM or your package manager of choice.

```bash
npm install git+git@github.com:guardian/interactive-source-components.git
```

The package exports CSS files for each component, eg.
`"@guardian/interactive-source-components/button.css"`, containing classes that make your HTML look
all Guardian.

These files can be imported using Javascript's `import`, or CSS's `@import`.

For example, using these styles in a Svelte component will look something like this.

```svelte
<script>
  import "@guardian/interactive-source-components/button.css"
  import "@guardian/interactive-source-components/icons.css"
</script>

<button class="src-button src-button--tertiary">
<div class="src-icon--add-to-basket"></div>
Click me
</button>
```

> [!WARNING]  
> These CSS files contain classes that cover all of the possible configuration options for each component, eg. `src-button--small`, `src-button--tertiary`.
>
> Ensure that your build system is set up to remove unused CSS classes, such as using the [@fullhuman/postcss-purgecss](https://www.npmjs.com/package/@fullhuman/postcss-purgecss) PostCSS plugin.

## Buttons

```html
<button class="src-button">Click me</button>
```

Use the `src-button` class to style your buttons in the default Guardian style. By default, buttons
are `medium` sized, and use the `primary` priority.

The following classes are available to configure the style and size of the button.

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

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-button--docs)&nbsp;&nbsp;<img style="margin-bottom: -3px" width="18" src="https://zeroheight.com/favicon.ico" /> [Source design system docs](https://theguardian.design/2a1e5182b/p/435225-button)

## Icons

```html
<div class="src-icon--add-to-basket"></div>
```

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

Make sure to set an appropriate `role` and `aria-label` on your element if the icon should
be exposed to screenreaders.

See Source's documentation for a full list of available icons.

<img width="16" src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/storybook/storybook-original.svg" /> [Source Storybook docs](https://guardian.github.io/storybooks/?path=/docs/source_react-components-button--docs)&nbsp;&nbsp;<img width="16" src="https://zeroheight.com/favicon.ico" /> [Source design system docs](https://theguardian.design/2a1e5182b/p/96fb61-iconography)
