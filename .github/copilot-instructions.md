We use Vue 3 with TypeScript for our frontends.
When writing code, ensure that you:

- Use latest Vue 3 features and syntax
- Utilize TypeScript
- Use the Composition API where appropriate
- Avoid writing new components if a suitable one exists in the KNIME component library (npm package: @knime/components; demo: https://knime.github.io/webapps-common/).
- Avoid using native HTML elements directly; instead, use the KNIME component library components (e.g., `<InputField>`, `<Checkbox>`, etc.)
- Avoid adding CSS unless absolutely necessary
- Never write inline styles
- Prefer using VueUse composables/utils (npm package: @vueuse/core; docs: https://vueuse.org/functions.html)) over writing custom code.
- For composables, follow VueUse best practices (https://vueuse.org/guide/best-practice.html)
- Never use lodash, use native JavaScript methods instead
